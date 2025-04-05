import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types/type";
import { getCuurrentUser } from "@/lib/appwrite/api";
export const INITIAL_USER = {
    id: "",
    userName: "",
    email: "",
    imageUrl: "",
    imageId: "",
    isOnline: false,
    companyName: ""
};
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};
type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};
const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined) {
            navigate("/login");
            return;
        }    

        checkAuthUser()
    }, []);
    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCuurrentUser();
            if (currentUser) {
                setUser({
                    id: currentUser.$id,
                    userName: currentUser.userName,
                    email: currentUser.email,
                    imageUrl: currentUser.imageUrl,
                    imageId: currentUser.imageId,
                    isOnline: currentUser.isOnline,
                    companyName: currentUser.companyName,
                });
                setIsAuthenticated(true);
                return true;
            } else {
                setIsAuthenticated(false);
                setUser(INITIAL_USER);
                navigate("/login"); // Redirect if user is not found
            }
            return false;
        } catch (error) {
            console.error("Auth Error:", error);
            setIsAuthenticated(false);
            setUser(INITIAL_USER);
            navigate("/login");
            return false;
        } finally {
            setIsLoading(false);
        }
    };



    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>;
}

export const useAuthContext = () => { return useContext(AuthContext) };

