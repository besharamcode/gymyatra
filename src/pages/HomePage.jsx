import { Link } from 'react-router-dom';
import { FiUsers, FiActivity, FiBarChart2, FiClipboard } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Track Your Fitness Journey with GymTrack
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            The ultimate gym management platform for trainers and members to
            track workouts, monitor progress, and achieve fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-md text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-md text-lg"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-gray-600">
                Easily manage member accounts, track attendance, and monitor
                progress.
              </p>
            </div>

            <div className="card text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiActivity className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workout Plans</h3>
              <p className="text-gray-600">
                Create customized workout plans tailored to each member's goals
                and fitness level.
              </p>
            </div>

            <div className="card text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiBarChart2 className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track progress with visual charts to help members stay motivated
                and accountable.
              </p>
            </div>

            <div className="card text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiClipboard className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diet Planning</h3>
              <p className="text-gray-600">
                Create and assign diet plans to complement workout regimens for
                maximum results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-white py-16 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Gym Management?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join GymTrack today and take your fitness business to the next level
            with our comprehensive management tools.
          </p>
          <Link
            to="/register"
            className="btn bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-md text-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 