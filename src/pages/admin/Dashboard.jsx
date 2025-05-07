import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiActivity,
  FiClipboard,
  FiBarChart2,
  FiArrowRight,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import AdminPageLayout from "../../components/ui/AdminPageLayout";
import AdminCard from "../../components/ui/AdminCard";

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
        const usersRes = await axios.get("/api/admin/users", config);
        const users = usersRes.data.data || [];

        // Fetch exercises
        const exercisesRes = await axios.get("/api/admin/exercises", config);
        const exercises = exercisesRes.data.data || [];

        // Fetch diet plans
        const dietPlansRes = await axios.get("/api/admin/diet-plans", config);
        const dietPlans = dietPlansRes.data.data || [];

        // We'll use these counts for stats
        setStats({
          totalUsers: users.length,
          totalExercises: exercises.length,
          totalDietPlans: dietPlans.length,
          totalWorkoutPlans: 0, // We'll add this later once we have the API
        });

        // Get the 5 most recent users
        const sortedUsers = [...users].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentUsers(sortedUsers.slice(0, 5));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  return (
    <AdminPageLayout
      title="Admin Dashboard"
      description="Manage your gym and track member progress"
      gradient="teal"
      headerHeight="30vh"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <AdminCard className="flex items-center">
            <div className="rounded-full bg-primary/10 p-4 mr-4">
              <FiUsers className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Members</h3>
              <p className="text-2xl font-bold text-primary">
                {stats.totalUsers}
              </p>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <AdminCard className="flex items-center">
            <div className="rounded-full bg-primary/10 p-4 mr-4">
              <FiActivity className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Exercises</h3>
              <p className="text-2xl font-bold text-primary">
                {stats.totalExercises}
              </p>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <AdminCard className="flex items-center">
            <div className="rounded-full bg-primary/10 p-4 mr-4">
              <FiClipboard className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Diet Plans</h3>
              <p className="text-2xl font-bold text-primary">
                {stats.totalDietPlans}
              </p>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <AdminCard className="flex items-center">
            <div className="rounded-full bg-primary/10 p-4 mr-4">
              <FiBarChart2 className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Workout Plans</h3>
              <p className="text-2xl font-bold text-primary">
                {stats.totalWorkoutPlans}
              </p>
            </div>
          </AdminCard>
        </motion.div>
      </div>

      {/* Recent Members */}
      <AdminCard className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Members</h2>
          <Link
            to="/admin/users"
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium flex items-center"
          >
            View All <FiArrowRight className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading members...
            </span>
          </div>
        ) : recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-border/30">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {recentUsers.map((user) => (
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
                            {user.isAdmin ? "Admin" : "Member"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
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

      {/* Quick Links */}
      <AdminCard>
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="bg-card hover:bg-card/80 border border-border/50 p-4 rounded-lg flex items-center transition-all hover:translate-y-[-2px]"
          >
            <div className="rounded-full bg-primary/10 p-3 mr-3">
              <FiUsers className="text-primary" />
            </div>
            <span>Manage Users</span>
          </Link>

          <Link
            to="/admin/exercises"
            className="bg-card hover:bg-card/80 border border-border/50 p-4 rounded-lg flex items-center transition-all hover:translate-y-[-2px]"
          >
            <div className="rounded-full bg-primary/10 p-3 mr-3">
              <FiActivity className="text-primary" />
            </div>
            <span>Manage Exercises</span>
          </Link>

          <Link
            to="/admin/diet-plans"
            className="bg-card hover:bg-card/80 border border-border/50 p-4 rounded-lg flex items-center transition-all hover:translate-y-[-2px]"
          >
            <div className="rounded-full bg-primary/10 p-3 mr-3">
              <FiClipboard className="text-primary" />
            </div>
            <span>Manage Diet Plans</span>
          </Link>
        </div>
      </AdminCard>
    </AdminPageLayout>
  );
};

export default Dashboard;
