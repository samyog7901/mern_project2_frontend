import { useState} from "react"
import Navbar from "../../assets/globals/components/navbar/Navbar"
import { useAppSelector } from "../../store/hooks"
// import { updatePassword } from "../../store/authSlice"

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth)
  // const dispatch = useAppDispatch()

  // Local state for password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    // try {
    //   await dispatch(updatePassword({ currentPassword, newPassword }))
    //   setMessage("Password updated successfully ✅")
    //   setCurrentPassword("")
    //   setNewPassword("")
    //   setConfirmPassword("")
    // } catch (err) {
    //   setMessage("Failed to update password ❌")
    // }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md ">
        {/* Profile Section */}
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Name:</span> {user?.username || "N/A"}</p>
          <p><span className="font-medium">Email:</span> {user?.email || "N/A"}</p>
          <p><span className="font-medium">Role:</span> {user?.role || "User"}</p>
        </div>

        {/* Change Password Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>

          {message && (
            <p className="mt-3 text-center text-sm font-medium text-red-500">
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
