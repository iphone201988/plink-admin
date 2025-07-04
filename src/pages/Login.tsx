import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pageTransition } from "@/lib/animations";
import Logo from "@/assets/logo.png";
import { useAdminLoginMutation } from "@/api";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [adminLogin] = useAdminLoginMutation();

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (remembered === "true" && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
        position: "topRight"
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await adminLogin({ email, password }).unwrap() as any;
  
      if (res) {
        const { access_token, refresh_token, role, name, email, _id } = res.user;
        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Remember Me logic
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
        }

        if (role === 1) {
          dispatch(
            login({
              id: Number(_id),
              name,
              email,
              role: String(role),
              isAuthenticated: true
            })
          );
  
          toast({
            title: "Welcome back!",
            description: res.message || "You have successfully logged in",
            variant: "success",
            position: "topRight"
          });
  
          navigate("/admin/dashboard");
        } else {
          toast({
            title: "Access Restricted",
            description: "You do not have permission to access the admin dashboard.",
            variant: "destructive",
            position: "topRight"
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: res?.message || "Invalid email or password",
          variant: "destructive",
          position: "topRight"
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error?.data?.message || "Invalid email or password",
        position: "topRight",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-secondary p-4"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div onClick={()=>navigate("/")} className="mx-auto cursor-pointer mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <img src={Logo} alt="Logo" className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Plink</CardTitle>
            <CardDescription>Enter your credentials to access admin account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
