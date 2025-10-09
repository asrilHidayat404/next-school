"use client"
import toast, { Toaster } from 'react-hot-toast';
import React from 'react'
import { Button } from './ui/button';

const Toast = () => {
    return <Button onClick={() => {
        toast.success('Successfully toasted!')
    }}>
        click me
    </Button>
}

export default Toast
