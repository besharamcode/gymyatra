import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiTrash2, FiEdit, FiUserCheck, FiUserX, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { updateProfile } from '../../redux/authSlice';

// Mock users data for demonstration
const MOCK_USERS = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: '',
    isActive: true,
    isAdmin: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    phone: '123-456-7890'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profilePic: '',
    isActive: true,
    isAdmin: false,
    createdAt: '2023-01-02T00:00:00.000Z',
    phone: ''
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    profilePic: '',
    isActive: false,
    isAdmin: false,
    createdAt: '2023-01-03T00:00:00.000Z',
    phone: '987-654-3210'
  }
];

const AdminUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Mock delete operation
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    }
  };

  const handleUpdateRole = (userId, isAdmin) => {
    // Mock update operation
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isAdmin } : user
    ));
    toast.success(`User is ${isAdmin ? 'now admin' : 'no longer admin'}`);
  };

  const handleActivateDeactivate = (userId, isActive) => {
    // Mock update operation
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isActive } : user
    ));
    toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
  };

  // Handle modal form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock update operation
    setUsers(users.map(user => 
      user._id === selectedUser._id ? { ...user, ...selectedUser } : user
    ));
    toast.success('User updated successfully');
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        <p className="text-gray-600 mt-1">Manage gym members and staff accounts</p>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="card overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading users...</p>
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <FiUser className="text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="mr-1 text-xs" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isAdmin ? 'Admin' : 'Member'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit />
                        </button>
                        {user.isActive ? (
                          <button
                            onClick={() => handleActivateDeactivate(user._id, false)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Deactivate user"
                          >
                            <FiUserX />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateDeactivate(user._id, true)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate user"
                          >
                            <FiUserCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateRole(user._id, !user.isAdmin)}
                          className="text-blue-600 hover:text-blue-900"
                          title={user.isAdmin ? "Remove admin role" : "Make admin"}
                        >
                          {user.isAdmin ? "Remove admin" : "Make admin"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="name"
                    name="name"
                    value={selectedUser.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    id="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    id="phone"
                    name="phone"
                    value={selectedUser.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 