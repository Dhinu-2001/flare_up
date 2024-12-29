import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import axiosInstance from "@/axiosconfig"
import { useDispatch } from "react-redux"
import { setAuthData, setLoading, setError } from "@/redux/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { encryptToken } from "@/utils/tokenUtil"
import { toast } from "sonner"

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username should contain only letters and numbers" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export default function Login() {

  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = useForm({
    resolver: zodResolver(schema),
  });
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    console.log(data)
    const { username, password } = data;
    try {
      dispatch(setLoading(true))
      const { data } = await axiosInstance.post('/login/', { username, password });

      const encryptedData = {
        ...data,
        accessToken: encryptToken(data.accessToken),
        refreshToken: encryptToken(data.refreshToken)
      }

      dispatch(setAuthData(encryptedData))

      toast.success('Login successfully')

      switch (encryptedData.role) {
        case 'hoster':
          navigate('/hoster/dashboard');
          break
        case 'admin':
          navigate('/admin/dashboard')
          break;
        case 'user':
          navigate('/')
          break;
        default:
          console.warn('Unknown role:', encryptedData.role)
      }

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
      
      dispatch(setError(errorMessage))
    } finally {
      dispatch(setLoading(false))
    }
  }

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 2000);
      return () => clearTimeout(timer);  // Cleanup timeout on component unmount or re-render
    }
  }, [errors, clearErrors]);

  async function GoogleAuthLogin(credential) {
    try {
      console.log('credential', credential)
      const gToken = credential
      // const decoded = jwtDecode(Gtoken)

      const { data } = await axiosInstance.post('/GoogleAuth/', { gToken });

      const encryptedData = {
        ...data,
        accessToken: encryptToken(data.accessToken),
        refreshToken: encryptToken(data.refreshToken)
      }

      dispatch(setAuthData(encryptedData))

      toast.success('Login successfully')

      switch (encryptedData.role) {
        case 'hoster':
          navigate('/hoster/dashboard');
          break
        case 'admin':
          navigate('/admin/dashboard')
          break;
        case 'user':
          navigate('/')
          break;
        default:
          console.warn('Unknown role:', encryptedData.role)
      }

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
    }
  }

  const RegisterNavigation = () => {
    navigate('/register')
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover and Attend the Best Events
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our event management platform connects you with the hottest events and makes it easy to secure your
                  tickets.
                </p>
              </div>
            </div>
            <img
              src="../../Images/user-login.jpg"
              width="550"
              height="550"
              alt="Concert"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Login Account</CardTitle>
                <CardDescription>Log in to start exploring and attending the best event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input {...register("username")} id="username" placeholder="Enter your username" autoComplete="username" />
                  {errors.username && (
                    <div className="text-red-500">{errors.username.message}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input {...register("password")} id="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
                  {errors.password && (
                    <div className="text-red-500">{errors.password.message}</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isSubmitting} type="submit" className="w-full">
                  {isSubmitting ? "Logging..." : "Login"}
                </Button>
                {errors.root && (
                  <div className="text-red-500">{errors.password.message}</div>
                )}

              </CardFooter>
            </form>
          </Card>
          <div className="flex justify-center">
            <div className="flex justify-between w-[450px] px-6 py-3">
              <Link to='/forgot-password'>
              <h1 className="text-sm text-gray-400 hover:underline cursor-pointer">Forgot password?</h1>
              </Link>
              <div className="flex gap-2 justify-center text-center ">
                <p className="text-sm text-gray-400">New user?   </p>
                <p className="cursor-pointer hover:underline text-sm font-medium" onClick={RegisterNavigation}>  register</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div>
              <hr className="bg-wite w-[480px] my-5" />
              <div className="flex justify-center">
                <GoogleLogin className='w-[400px]'
                  accessType="offline"
                  prompt='consent'
                  scope="https://www.googleapis.com/auth/yt-analytics.readonly"
                  onSuccess={codeResponse => {
                    GoogleAuthLogin(codeResponse?.credential);
                  }}
                  onError={(error) => {
                    console.log('Login Failed', error);
                    toast.error('Google login failed')
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

