import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiTrash2,
  FiEdit,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { updateProfile } from "../../redux/authSlice";
import AdminPageLayout from "../../components/ui/AdminPageLayout";
import AdminCard from "../../components/ui/AdminCard";

// Mock users data for demonstration
const MOCK_USERS = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    profilePic: "",
    isActive: true,
    isAdmin: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    phone: "123-456-7890",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    profilePic: "",
    isActive: true,
    isAdmin: false,
    createdAt: "2023-01-02T00:00:00.000Z",
    phone: "",
  },
  {
    _id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    profilePic: "",
    isActive: false,
    isAdmin: false,
    createdAt: "2023-01-03T00:00:00.000Z",
    phone: "987-654-3210",
  },
];

const AdminUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // In a real app, this would fetch from the API
  useEffect(() => {
    // Mock API call
    setIsLoading(true);
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Mock delete operation
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    }
  };

  const handleUpdateRole = (userId, isAdmin) => {
    // Mock update operation
    setUsers(
      users.map((user) => (user._id === userId ? { ...user, isAdmin } : user))
    );
    toast.success(`User is ${isAdmin ? "now admin" : "no longer admin"}`);
  };

  const handleActivateDeactivate = (userId, isActive) => {
    // Mock update operation
    setUsers(
      users.map((user) => (user._id === userId ? { ...user, isActive } : user))
    );
    toast.success(
      `User ${isActive ? "activated" : "deactivated"} successfully`
    );
  };

  // Handle modal form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock update operation
    setUsers(
      users.map((user) =>
        user._id === selectedUser._id ? { ...user, ...selectedUser } : user
      )
    );
    toast.success("User updated successfully");
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AdminPageLayout
      title="User Management"
      description="Manage gym members and staff accounts"
      gradient="purple"
    >
      {/* Search & Filter */}
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FiPlus className="mr-2" /> 
            Add User
          </button>
        </div>
      </AdminCard>

      {/* Users List */}
      <AdminCard title="All Users">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading users...
            </span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-secondary/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <FiUser className="text-primary" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <FiMail className="mr-1" /> {user.email}
                        </div>
                        {user.phone && <div className="text-xs text-muted-foreground mt-1">{user.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 rounded-full hover:bg-primary/10 text-primary transition-colors"
                          title="Edit User"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-1 rounded-full hover:bg-red-100 text-red-500 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                        </button>
                        {user.isActive ? (
                          <button
                            onClick={() =>
                              handleActivateDeactivate(user._id, false)
                            }
                            className="p-1 rounded-full hover:bg-yellow-100 text-yellow-600 dark:hover:bg-yellow-900/30 transition-colors"
                            title="Deactivate User"
                          >
                            <FiUserX size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleActivateDeactivate(user._id, true)
                            }
                            className="p-1 rounded-full hover:bg-green-100 text-green-600 dark:hover:bg-green-900/30 transition-colors"
                            title="Activate User"
                          >
                            <FiUserCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </AdminCard>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card text-card-foreground p-6 rounded-xl shadow-xl border border-border max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={selectedUser.name}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={selectedUser.phone || ""}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      name="isAdmin"
                      checked={selectedUser.isAdmin}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          isAdmin: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary border-border rounded focus:ring-primary/30"
                    />
                    <label
                      htmlFor="isAdmin"
                      className="ml-2 block text-sm text-foreground"
                    >
                      Admin
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={selectedUser.isActive}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          isActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary border-border rounded focus:ring-primary/30"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-foreground"
                    >
                      Active
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminUsers;
