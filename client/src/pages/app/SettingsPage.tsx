import { useMeQuery, useLogoutMutation } from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const nav = useNavigate();
  const { data } = useMeQuery();
  const [logout] = useLogoutMutation();

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="text-sm">UserId: {data?.userId}</div>

      <button
        className="rounded-lg border px-3 py-2 text-sm"
        onClick={async () => {
          await logout();
          nav("/", { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
}
