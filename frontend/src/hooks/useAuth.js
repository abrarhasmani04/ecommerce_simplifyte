const useAuth = () => {
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    return {
        token,
        user,
        isAuthenticated: !!token,
    };
};

export default useAuth;