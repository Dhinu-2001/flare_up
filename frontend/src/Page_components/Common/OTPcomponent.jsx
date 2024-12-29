'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosconfig';
import { useDispatch } from "react-redux"
import { setAuthData } from "@/redux/auth/authSlice"
import { toast } from 'sonner';

const TIMER_DURATION = 60; // 60 seconds

export default function OTPInputPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const dispatch = useDispatch();

  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
    setIsActive(true);
  }, []);

  useEffect(() => {
    const storedEndTime = localStorage.getItem('otpEndTime');
    if (storedEndTime) {
      const remainingTime = Math.max(0, Math.floor((parseInt(storedEndTime) - Date.now()) / 1000));
      setTimeLeft(remainingTime);
      setIsActive(remainingTime > 0);
    } else {
      startTimer();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            localStorage.removeItem('otpEndTime');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      localStorage.setItem('otpEndTime', (Date.now() + timeLeft * 1000).toString());
    }
  }, [timeLeft, isActive]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit otp')
    const email = localStorage.getItem('registeredEmail');
    const url = localStorage.getItem('OTP_url');
    console.log('local', email, url)
    const enteredOtp = otp.join('');

    try {
      if (url === 'registration') {
        const { data } = await axiosInstance.post('/otp_verification/', { email, enteredOtp });
        console.log(data);
        toast.success('Email verified.')
        navigate('/login');
      } else if (url === 'forgot-password') {
        const { data } = await axiosInstance.post('/verify-otp-forgot-password/', { email, enteredOtp });
        console.log(data);
        toast.success('Email verified.')
        navigate('/new-password');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'OTP verification failed'
      toast.error(errorMessage)
    }
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem('registeredEmail');
    console.log('resend otp', email)

    try {
      await axiosInstance.post('/resend_otp/', { email });
      startTimer();
      setOtp(['', '', '', '', '', '']);
      console.log('OTP resent');
      toast.info('An new OTP has sent to your registered email.')
    } catch (error) {
      console.log('Resend OTP failed:', error);
      const errorMessage = error.response?.data?.error || 'Resend OTP failed'
      toast.error(errorMessage)
      navigate('/register')
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(210 40% 98%)] flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Enter OTP</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit code to your registered email address
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex justify-center mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={el => inputRefs.current[index] = el}
                  value={digit}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl mx-1 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  aria-label={`Digit ${index + 1} of OTP`}
                />
              ))}
            </div>
            <Label htmlFor="otp-input" className="sr-only">Enter your 6-digit OTP</Label>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-center mt-4">
        {timeLeft > 0 ? (
          `Time remaining: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
        ) : (
          <Button onClick={handleResendOTP} variant="link" className="p-0" disabled={isActive}>
            Resend OTP
          </Button>
        )}
      </p>
    </div>
  );
}