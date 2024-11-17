import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import axiosInstance from "@/axiosconfig"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux"
import { encryptToken } from "@/utils/tokenUtil"
import { useDispatch } from "react-redux"
import { setAuthData, setLoading, setError } from "@/redux/auth/authSlice"
import { toast } from "sonner"

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username should contain only letters and numbers" }),
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Full name should only contain letters and spaces" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export default function HosterRegister() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = useForm({
    resolver: zodResolver(schema),
  });

  const loginStateValue = useSelector((store)=>store.isLoggedIn)
  const roleValue = useSelector((store)=>store.role)

  useEffect(()=>{
    
    if(loginStateValue == true){
      if(roleValue == 'hoster'){
        navigate('/hoster')
      }else if(roleValue == 'admin'){
        navigate('/admin_dashboard')
      }else if(roleValue == 'user'){
        navigate('/')
      }
    }

  },[])



  const onSubmit = async (data) => {
    const { username, fullname, email, phone_number, password } = data;
    const role = 'hoster'
    localStorage.setItem('registeredEmail', email)
    localStorage.setItem('AuthType', 'NormalAuth')
    console.log(username, fullname, phone_number, email, password, role)
    try {
      const response = await axiosInstance.post('/register/', { username, fullname, email, phone_number, role, password });
      console.log(response.data)
      navigate('/otp_verification')
      toast.info('An OTP has sent to your registered email.')
    } catch (error) {
      console.log('register Failed: ', error)
      toast.error('registration failed')
    }
  }

  async function GoogleOauthRegisteration(credential) {
    try {
      const gToken = credential
      const decoded = jwtDecode(gToken)

      const username = decoded.name
      const fullname = decoded.name
      const email = decoded.email
      const role = 'hoster'
      console.log(username, fullname, email, role)
      localStorage.setItem('registeredEmail', email)
      localStorage.setItem('AuthType', 'GoogleAuth')
      
      const {data} = await axiosInstance.post('/GoogleAuth/', { gToken, role });
      console.log(data)

      const encryptedData = {
        ...data,
        accessToken: encryptToken(data.accessToken),
        refreshToken: encryptToken(data.refreshToken)
      }

      dispatch(setAuthData(encryptedData))
      toast.success('Registered successfully')

      switch (encryptedData.role) {
        case 'hoster':
          navigate('/hoster');
          break
        case 'admin':
          navigate('/admin_dashboard')
          break;
        case 'user':
          navigate('/')
          break;
        default:
          console.warn('Unknown role:', encryptedData.role)
      }

      
    } catch (error) {
      console.log('Register Failed', error)
      toast.error('Registration failed')
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

  const LoginNavigation = () => {
    navigate('/login')
  }

  const UserRegisterNavigation = () =>{
    navigate('/register')
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-900">
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
                <CardTitle>Register for an Account</CardTitle>
                <CardDescription>Sign up to start exploring and attending the best event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input {...register("username")} id="username" placeholder="Enter your username" />
                  {errors.username && (
                    <div className="text-red-500">{errors.username.message}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input {...register("fullname")} id="fullName" placeholder="Enter your full name" />
                  {errors.fullname && (
                    <span className="text-red-500">{errors.fullname.message}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register("email")} id="email" placeholder="Enter your email" />
                  {errors.email && (
                    <div className="text-red-500">{errors.email.message}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input {...register("phone_number")} id="phone" type="tel" placeholder="Enter your phone number" />
                  {errors.phone_number && (
                    <div className="text-red-500">{errors.phone_number.message}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input {...register("password")} id="password" type="password" placeholder="Enter your password" />
                  {errors.password && (
                    <div className="text-red-500">{errors.password.message}</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isSubmitting} type="submit" className="w-full">
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
                {errors.root && (
                  <div className="text-red-500">{errors.password.message}</div>
                )}
              </CardFooter>
            </form>
          </Card>

          <div className="flex justify-center">
            <div className="flex justify-between w-[450px] px-6 py-3">
              <h1 className="text-sm text-gray-400 hover:underline cursor-pointer" onClick={UserRegisterNavigation}>Register as a normal user?</h1>
              <div className="flex gap-2 justify-center text-center ">
                <p className="text-sm text-gray-400">Already have an account?</p>
                <p className="text-sm text-white font-medium cursor-pointer hover:underline" onClick={LoginNavigation}>Login</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <hr className="bg-wite w-[480px] my-5" />
              <div className="flex justify-center">
                <GoogleLogin className='w-[400px] '
                  onSuccess={codeResponse => {
                    console.log('credential response', codeResponse);
                    GoogleOauthRegisteration(codeResponse?.credential);
                  }}
                  onError={() => {
                    console.log('Login Failed', errorMessage);
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