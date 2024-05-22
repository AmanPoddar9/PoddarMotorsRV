'use client'
import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Link from 'next/link'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
      // url = 'http://localhost:5000/'

      const response = await axios.post(url + 'api/user/login', {
        username: username.trim(),
        password,
      })
      const token = response.data.token
      localStorage.setItem('jwt_token', token)
      if (response.status == 200) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = './home'
        }, 1000)
      } else {
        setSuccess(false)
      }

      // Optionally, you can redirect the user to another page after successful login
    } catch (error) {
      setSuccess(false)
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        {success == true ? (
          <h3 className="mt-6 text-center text-green-500 text-lg font-extrabold">
            Logged in successfully
          </h3>
        ) : success == false ? (
          <h3 className="mt-6 text-center text-red-500 text-lg font-extrabold">
            Error Logging in
          </h3>
        ) : (
          <></>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        {/* <div className="text-center">
          <p>Don't have an account?</p>
          <Link
            className="text-indigo-600 hover:text-indigo-700"
            href="/admin/signup"
          >
            Sign up
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default Login
