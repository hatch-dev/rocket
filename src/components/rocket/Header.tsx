import { getAsset } from "@/utils/getAsset";
import { useRouter } from "next/navigation";

export function RocketHeader({ employee }: any) {
  const router = useRouter();
  return (
    <div className="header">
      <div className="logo" onClick={()=>{ router.push('/rocket/employee/dashboard')}}>
        <img src={getAsset("images/rocket-logo.png")} alt="Rocket" />
        <span>by MOONLANDING</span>
      </div>
      <div className="user">
        
        <button className="admin-btn" type="button">
          Employee Dashboard
        </button>
      </div>
    </div>
  );
}

