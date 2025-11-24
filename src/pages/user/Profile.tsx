import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  LogOut,
  Bell,
  Shield,
  Heart,
  Activity,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import logoIcon from "@/assets/logo-icon.png";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    phone: "+62 812 3456 7890",
    birthDate: "1995-05-15",
    location: "Jember, Jawa Timur",
    bio: "Seorang ibu dengan 1 anak yang peduli dengan kesehatan keluarga.",
    emergencyContact: "+62 813 9876 5432",
    bloodType: "A+",
  });

  const [healthData] = useState({
    lastCheckup: "2024-10-15",
    nextCheckup: "2025-01-15",
    bmi: 22.5,
    bloodPressure: "120/80",
    allergies: ["Seafood", "Penicillin"],
  });

  const [activities] = useState([
    {
      id: 1,
      type: "article",
      title: "Membaca: Cara Mengatasi Nyeri Haid",
      date: "2024-11-20",
      icon: FileText,
    },
    {
      id: 2,
      type: "checkup",
      title: "Pemeriksaan Kesehatan Rutin",
      date: "2024-10-15",
      icon: Activity,
    },
    {
      id: 3,
      type: "analysis",
      title: "Analisa Kesehatan Reproduksi",
      date: "2024-09-28",
      icon: Heart,
    },
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
    console.log("Saving profile data:", userData);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <nav className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-3">
              <img src={logoIcon} alt="SheCare Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-accent">SheCare</span>
            </a>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/">Kembali ke Beranda</a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-4xl font-bold">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-foreground">
                      {userData.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="w-fit mx-auto md:mx-0"
                    >
                      Member Aktif
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{userData.bio}</p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={16} />
                      {userData.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {userData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Bergabung Nov 2024
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Profil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Simpan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      Batal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit">
              <TabsTrigger value="info">Informasi</TabsTrigger>
              <TabsTrigger value="health">Kesehatan</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pribadi</CardTitle>
                  <CardDescription>
                    Kelola informasi pribadi dan kontak darurat Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nomor Telepon</Label>
                      <Input
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tanggal Lahir</Label>
                      <Input
                        type="date"
                        value={userData.birthDate}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            birthDate: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lokasi</Label>
                      <Input
                        value={userData.location}
                        onChange={(e) =>
                          setUserData({ ...userData, location: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Golongan Darah</Label>
                      <Input
                        value={userData.bloodType}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            bloodType: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={userData.bio}
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Kontak Darurat</Label>
                    <Input
                      value={userData.emergencyContact}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          emergencyContact: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health Data Tab */}
            <TabsContent value="health" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="text-primary" size={20} />
                      Data Kesehatan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">BMI</span>
                      <span className="font-semibold">{healthData.bmi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tekanan Darah
                      </span>
                      <span className="font-semibold">
                        {healthData.bloodPressure} mmHg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pemeriksaan Terakhir
                      </span>
                      <span className="font-semibold">15 Okt 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pemeriksaan Berikutnya
                      </span>
                      <span className="font-semibold text-primary">
                        15 Jan 2025
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="text-primary" size={20} />
                      Alergi & Kondisi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Alergi:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {healthData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Edit2 size={16} className="mr-2" />
                      Update Data Kesehatan
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Medis</CardTitle>
                  <CardDescription>
                    Catatan pemeriksaan dan konsultasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Belum ada riwayat medis</p>
                    <Button variant="link" className="mt-2">
                      Tambah Riwayat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>
                    Riwayat aktivitas Anda di SheCare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          <activity.icon size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                        <ChevronRight
                          size={20}
                          className="text-muted-foreground"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Notifikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifikasi</p>
                      <p className="text-sm text-muted-foreground">
                        Terima update artikel dan tips kesehatan
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pengingat Pemeriksaan</p>
                      <p className="text-sm text-muted-foreground">
                        Notifikasi untuk jadwal pemeriksaan rutin
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Keamanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Ubah Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Autentikasi Dua Faktor
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Hapus Akun
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
