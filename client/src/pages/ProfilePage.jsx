import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlinePencilSquare,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineLink,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { useAuth } from '../hooks/useAuth';
import usePageTitle from '../hooks/usePageTitle';
import * as authService from '../services/authService';
import * as listService from '../services/listService';
import { LIST_TYPES } from '../utils/constants';
import Spinner from '../components/ui/Spinner';
import ConfirmModal from '../components/ui/ConfirmModal';

const ProfilePage = () => {
  const { user, logout, updateUser, updateToken } = useAuth();
  const navigate = useNavigate();

  usePageTitle('Profile');

  // Stats
  const [stats, setStats] = useState({ favorites: 0, watchlist: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Edit Profile
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    avatar: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Change Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete Account
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Sync profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [favRes, watchRes] = await Promise.all([
        listService.getList(LIST_TYPES.FAVORITE, 1),
        listService.getList(LIST_TYPES.WATCHLIST, 1),
      ]);
      setStats({
        favorites: favRes.data.total,
        watchlist: watchRes.data.total,
      });
    } catch {
      setStats({ favorites: 0, watchlist: 0 });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // --- Profile Update ---
  const validateProfile = () => {
    const errors = {};
    if (!profileForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (
      profileForm.username.trim().length < 2 ||
      profileForm.username.trim().length > 30
    ) {
      errors.username = 'Username must be 2–30 characters';
    }

    if (profileForm.avatar.trim()) {
      try {
        new URL(profileForm.avatar.trim());
      } catch {
        errors.avatar = 'Please enter a valid URL';
      }
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setProfileSubmitting(true);
    try {
      const { data } = await authService.updateProfile({
        username: profileForm.username.trim(),
        avatar: profileForm.avatar.trim() || undefined,
      });
      updateUser(data.user);
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setProfileSubmitting(false);
    }
  };

  // --- Password Change ---
  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordSubmitting(true);
    try {
      const { data } = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (data.token) {
        updateToken(data.token);
      }
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // --- Delete Account ---
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Password is required');
      return;
    }

    setDeleteSubmitting(true);
    try {
      await authService.deleteAccount({ password: deletePassword });
      setDeleteModalOpen(false);
      setDeletePassword('');
      logout();
      navigate('/');
      toast.success('Account deleted');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletePassword('');
  };

  // Avatar initials fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* ── Profile Header ── */}
      <section className="rounded-2xl border border-border-dark bg-surface-dark/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-24 w-24 rounded-full border-2 border-primary object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-3xl font-bold text-primary">
              {getInitials(user.username)}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-text-dark">
              {user.username}
            </h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-text-muted-dark sm:justify-start">
              <HiOutlineEnvelope className="h-4 w-4" />
              {user.email}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-text-muted-dark sm:justify-start">
              <HiOutlineCalendarDays className="h-4 w-4" />
              Member since {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg border border-border-dark px-4 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-white/10"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border-dark bg-surface-dark/60 p-5 backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
            <HiOutlineHeart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-dark">
              {statsLoading ? '–' : stats.favorites}
            </p>
            <p className="text-sm text-text-muted-dark">Favorites</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border-dark bg-surface-dark/60 p-5 backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15">
            <HiOutlineBookmark className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-dark">
              {statsLoading ? '–' : stats.watchlist}
            </p>
            <p className="text-sm text-text-muted-dark">Watchlist</p>
          </div>
        </div>
      </section>

      {/* ── Edit Profile Section ── */}
      {isEditing && (
        <section className="mt-6 rounded-2xl border border-border-dark bg-surface-dark/60 p-6 backdrop-blur-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-text-dark">
            <HiOutlineUser className="h-5 w-5 text-primary" />
            Edit Profile
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-text-dark"
              >
                Username
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  disabled={profileSubmitting}
                  maxLength={30}
                  autoComplete="username"
                  className={`w-full rounded-lg border bg-background-dark py-2.5 pr-4 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    profileErrors.username
                      ? 'border-danger'
                      : 'border-border-dark hover:border-text-muted-dark'
                  }`}
                />
              </div>
              {profileErrors.username && (
                <p className="mt-1 text-sm text-danger">
                  {profileErrors.username}
                </p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label
                htmlFor="avatar"
                className="mb-1.5 block text-sm font-medium text-text-dark"
              >
                Avatar URL
              </label>
              <div className="relative">
                <HiOutlineLink className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
                <input
                  id="avatar"
                  name="avatar"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileForm.avatar}
                  onChange={handleProfileChange}
                  disabled={profileSubmitting}
                  className={`w-full rounded-lg border bg-background-dark py-2.5 pr-4 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    profileErrors.avatar
                      ? 'border-danger'
                      : 'border-border-dark hover:border-text-muted-dark'
                  }`}
                />
              </div>
              {profileErrors.avatar && (
                <p className="mt-1 text-sm text-danger">
                  {profileErrors.avatar}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profileSubmitting && <Spinner size="sm" />}
                Save Changes
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── Change Password Section ── */}
      <section className="mt-6 rounded-2xl border border-border-dark bg-surface-dark/60 p-6 backdrop-blur-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-text-dark">
          <HiOutlineLockClosed className="h-5 w-5 text-primary" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-sm font-medium text-text-dark"
            >
              Current Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordSubmitting}
                  autoComplete="current-password"
                className={`w-full rounded-lg border bg-background-dark py-2.5 pr-10 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordErrors.currentPassword
                    ? 'border-danger'
                    : 'border-border-dark hover:border-text-muted-dark'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted-dark transition-colors hover:text-text-dark"
                aria-label={
                  showPasswords.current ? 'Hide password' : 'Show password'
                }
              >
                {showPasswords.current ? (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-danger">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-text-dark"
            >
              New Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordSubmitting}
                  autoComplete="new-password"
                className={`w-full rounded-lg border bg-background-dark py-2.5 pr-10 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordErrors.newPassword
                    ? 'border-danger'
                    : 'border-border-dark hover:border-text-muted-dark'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted-dark transition-colors hover:text-text-dark"
                aria-label={
                  showPasswords.new ? 'Hide password' : 'Show password'
                }
              >
                {showPasswords.new ? (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-danger">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="mb-1.5 block text-sm font-medium text-text-dark"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordSubmitting}
                  autoComplete="new-password"
                className={`w-full rounded-lg border bg-background-dark py-2.5 pr-10 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordErrors.confirmNewPassword
                    ? 'border-danger'
                    : 'border-border-dark hover:border-text-muted-dark'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted-dark transition-colors hover:text-text-dark"
                aria-label={
                  showPasswords.confirm ? 'Hide password' : 'Show password'
                }
              >
                {showPasswords.confirm ? (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordErrors.confirmNewPassword && (
              <p className="mt-1 text-sm text-danger">
                {passwordErrors.confirmNewPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordSubmitting && <Spinner size="sm" />}
              Change Password
            </button>
          </div>
        </form>
      </section>

      {/* ── Danger Zone ── */}
      <section className="mt-6 rounded-2xl border-2 border-danger/40 bg-surface-dark/60 p-6 backdrop-blur-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-danger">
          <HiOutlineTrash className="h-5 w-5" />
          Danger Zone
        </h2>
        <p className="mb-4 text-sm text-text-muted-dark">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-white"
        >
          Delete Account
        </button>
      </section>

      {/* ── Delete Account Modal ── */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Account"
        message="This action cannot be undone. All your favorites and watchlist items will be permanently deleted."
        confirmLabel={deleteSubmitting ? 'Deleting…' : 'Delete Account'}
        cancelLabel="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={handleCancelDelete}
        variant="danger"
      >
        <div>
          <label
            htmlFor="deletePassword"
            className="mb-1.5 block text-sm font-medium text-text-dark"
          >
            Enter your password to confirm
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted-dark" />
            <input
              id="deletePassword"
              type="password"
              placeholder="Your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={deleteSubmitting}
              className="w-full rounded-lg border border-border-dark bg-background-dark py-2.5 pr-4 pl-10 text-text-dark placeholder-text-muted-dark transition-colors focus:outline-none focus:ring-2 focus:ring-danger hover:border-text-muted-dark"
            />
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default ProfilePage;
