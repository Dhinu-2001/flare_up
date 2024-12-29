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
    email: z
        .string()
        .email({ message: "Please enter a valid email address" }),
});

export default function ForgotPassword() {

    const navigate = useNavigate()
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = useForm({
        resolver: zodResolver(schema),
    });
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        const { email } = data;
        localStorage.setItem('registeredEmail', data.email)
        localStorage.setItem('OTP_url', 'forgot-password')
        try {
            dispatch(setLoading(true))
            await axiosInstance.post('/forgot-password/', { email });

            // const encryptedData = {
            //     ...data,
            //     accessToken: encryptToken(data.accessToken),
            //     refreshToken: encryptToken(data.refreshToken)
            // }

            // dispatch(setAuthData(encryptedData))

            navigate('/otp_verification')
            toast.info('An OTP has sent to your entered email.')


        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Forgot password failed'
            toast.error(errorMessage)
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

    // async function GoogleAuthLogin(credential) {
    //     try {
    //         console.log('credential', credential)
    //         const gToken = credential
    //         // const decoded = jwtDecode(Gtoken)

    //         const { data } = await axiosInstance.post('/GoogleAuth/', { gToken });

    //         const encryptedData = {
    //             ...data,
    //             accessToken: encryptToken(data.accessToken),
    //             refreshToken: encryptToken(data.refreshToken)
    //         }

    //         dispatch(setAuthData(encryptedData))

    //         toast.success('Login successfully')

    //         switch (encryptedData.role) {
    //             case 'hoster':
    //                 navigate('/hoster/dashboard');
    //                 break
    //             case 'admin':
    //                 navigate('/admin/dashboard')
    //                 break;
    //             case 'user':
    //                 navigate('/')
    //                 break;
    //             default:
    //                 console.warn('Unknown role:', encryptedData.role)
    //         }

    //     } catch (error) {
    //         const errorMessage = error.response?.data?.error || 'Login failed'
    //         toast.error(errorMessage)
    //     }
    // }

    const RegisterNavigation = () => {
        navigate('/register')
    }

    return (
        <div className="flex flex-col min-h-[100dvh]">
            {/* <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
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
            </section> */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <Card className="mx-auto max-w-md">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle>Forgot Password</CardTitle>
                                {/* <CardDescription>Log in to start exploring and attending the best event.</CardDescription> */}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Enter your email</Label>
                                    <Input {...register("email")} id="email" placeholder="Enter your registered email" autoComplete="username" />
                                    {errors.email && (
                                        <div className="text-red-500">{errors.email.message}</div>
                                    )}
                                </div>
                                {/* <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input {...register("password")} id="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
                                    {errors.password && (
                                        <div className="text-red-500">{errors.password.message}</div>
                                    )}
                                </div> */}
                            </CardContent>
                            <CardFooter>
                                <Button disabled={isSubmitting} type="submit" className="w-full">
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                                {errors.root && (
                                    <div className="text-red-500">{errors.root.message}</div>
                                )}

                            </CardFooter>
                        </form>
                    </Card>
                    <div className="flex justify-center">
                        <div className="flex justify-between w-[450px] px-6 py-3">
                            <Link to='/login'>
                                <h1 className="text-sm text-gray-400 hover:underline cursor-pointer">Back to login.</h1>
                            </Link>
                            <div className="flex gap-2 justify-center text-center ">
                                <p className="text-sm text-gray-400">New user?   </p>
                                <p className="cursor-pointer hover:underline text-sm font-medium" onClick={RegisterNavigation}>  register</p>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex justify-center">
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
                    </div> */}
                </div>
            </section>
        </div>
    )
}

