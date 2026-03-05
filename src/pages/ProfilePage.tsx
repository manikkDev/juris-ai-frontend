import { useState } from "react";
import { useAuth } from "@/services/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCircle, Save } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [court, setCourt] = useState(user?.court || "");

  const handleSave = () => {
    if (user) {
      const profile = { ...user, name, court };
      localStorage.setItem(`juris_profile_${user.uid}`, JSON.stringify(profile));
      toast.success("Profile updated successfully");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user?.role} · {user?.court}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input value={user?.email || ""} disabled className="bg-muted" /></div>
          <div><Label>Role</Label><Input value={user?.role || ""} disabled className="bg-muted capitalize" /></div>
          <div><Label>Court</Label><Input value={court} onChange={(e) => setCourt(e.target.value)} /></div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />Save Changes</Button>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2 text-xs">
          {[
            "Viewed case JC-2024-0003",
            "Ran fast-track simulation",
            "Updated profile settings",
            "Reviewed AI insights",
          ].map((activity, i) => (
            <div key={i} className="py-2 px-3 rounded-md bg-muted/50">{activity}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
