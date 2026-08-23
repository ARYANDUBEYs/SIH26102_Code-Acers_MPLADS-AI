import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [role, setRole] = useState(ROLES.CITIZEN);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === ROLES.CITIZEN ? '/public' : '/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100">Create Citizen / Officer Account</h3>
        <p className="text-xs text-slate-400">Register to track projects, monitor public funds, and file grievances</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
          placeholder="e.g. Ramesh Kumar"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          placeholder="name@example.com"
          required
        />

        <Input
          label="District & State"
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          icon={MapPin}
          placeholder="e.g. Varanasi, Uttar Pradesh"
          required
        />

        <Input
          label="Create Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          placeholder="••••••••••••"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full shadow-glow-blue"
          isLoading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Register & Continue
        </Button>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};
