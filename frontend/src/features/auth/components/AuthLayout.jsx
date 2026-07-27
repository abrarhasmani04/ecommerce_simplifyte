import { Outlet } from "react-router-dom";
import Card from "../../../components/common/Card";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
