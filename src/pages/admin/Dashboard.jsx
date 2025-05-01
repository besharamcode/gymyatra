import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUsers, FiActivity, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExercises: 0,
    totalDietPlans: 0,
    totalWorkoutPlans: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch users
        const usersRes = await axios.get('/api/admin/users', config);
        const users = usersRes.data.data || [];
        
        // Fetch exercises
        const exercisesRes = await axios.get('/api/admin/exercises', config);
        const exercises = exercisesRes.data.data || [];
        
        // Fetch diet plans
        const dietPlansRes = await axios.get('/api/admin/diet-plans', config);
        const dietPlans = dietPlansRes.data.data || [];
        
        // We'll use these counts for stats
        setStats({
          totalUsers: users.length,
          totalExercises: exercises.length,
          totalDietPlans: dietPlans.length,
          totalWorkoutPlans: 0, // We'll add this later once we have the API
        });
        
        // Get the 5 most recent users
        const sortedUsers = [...users].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentUsers(sortedUsers.slice(0, 5));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your gym and track member progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiUsers className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Members</h3>
            <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiActivity className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Exercises</h3>
            <p className="text-2xl font-bold text-primary">{stats.totalExercises}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiClipboard className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Diet Plans</h3>
            <p className="text-2xl font-bold text-primary">{stats.totalDietPlans}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiBarChart2 className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Workout Plans</h3>
            <p className="text-2xl font-bold text-primary">{stats.totalWorkoutPlans}</p>
          </div>
        </div>
      </div>

      {/* Recent Members */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Members</h2>
          <Link to="/admin/users" className="text-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <p>Loading members...</p>
        ) : recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/admin/users/${member._id}`} 
                        className="text-primary hover:underline mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4">No members found</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/users" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <FiUsers className="mx-auto text-4xl text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Members</h3>
            <p className="text-sm text-gray-600">View and edit member details</p>
          </div>
        </Link>
        
        <Link to="/admin/exercises" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <FiActivity className="mx-auto text-4xl text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Exercises</h3>
            <p className="text-sm text-gray-600">Create and manage exercises</p>
          </div>
        </Link>
        
        <Link to="/admin/diet-plans" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <FiClipboard className="mx-auto text-4xl text-primary mb-2" />
            <h3 className="font-semibold mb-1">Diet Plans</h3>
            <p className="text-sm text-gray-600">Create and manage diet plans</p>
          </div>
        </Link>
        
        <Link to="/admin/workout-plans" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <FiBarChart2 className="mx-auto text-4xl text-primary mb-2" />
            <h3 className="font-semibold mb-1">Workout Plans</h3>
            <p className="text-sm text-gray-600">Create and assign workout plans</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 