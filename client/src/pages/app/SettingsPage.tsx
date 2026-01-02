import { useMeQuery, useLogoutMutation } from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Shield, Bell, Palette, Database, HelpCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const nav = useNavigate();
  const { data, isLoading, isError } = useMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    nav("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-zinc-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-zinc-200 rounded"></div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="h-6 w-40 bg-zinc-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-zinc-200 rounded"></div>
            <div className="h-4 w-2/3 bg-zinc-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center max-w-2xl">
        <div className="mx-auto w-fit rounded-full bg-red-100 p-3 mb-3">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <h3 className="font-semibold text-red-900">Failed to load settings</h3>
        <p className="mt-1 text-sm text-red-700">There was an error loading your account information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Settings</h1>
        <p className="my-4 text-xs text-zinc-600">Manage your account settings and preferences</p>
      </div>

      {/* Account Information Section */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">Account Information</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-600 mb-1">User ID</div>
              <div className="text-sm text-zinc-900 font-mono bg-white px-3 py-2 rounded border border-zinc-200">
                {data?.userId}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="rounded-lg bg-blue-100 p-2 mt-0.5">
              <Shield size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-900">Account Status</div>
              <div className="text-sm text-blue-700 mt-1">Your account is active and secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">Preferences</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Bell size={18} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">Notifications</div>
                <div className="text-xs text-zinc-600">Manage notification preferences</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">Coming soon</div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Database size={18} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">Data & Privacy</div>
                <div className="text-xs text-zinc-600">Control your data and privacy settings</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">Coming soon</div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">Support</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
            <div className="text-sm text-zinc-600">
              Need help? Visit our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                Help Center
              </a>{" "}
              or{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border-2 border-red-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-red-200 bg-red-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-zinc-900 mb-1">Sign Out</h3>
              <p className="text-sm text-zinc-600">
                Sign out of your account on this device. You'll need to sign in again to access your issues.
              </p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <LogOut size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Sign Out</h3>
                <p className="text-sm text-zinc-600">
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}