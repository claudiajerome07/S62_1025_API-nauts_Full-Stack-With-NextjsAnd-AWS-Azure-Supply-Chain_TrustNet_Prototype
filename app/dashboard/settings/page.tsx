"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Bell,
  Eye,
  Shield,
  Globe,
  Phone,
  Mail,
  Save,
  Check,
  AlertTriangle,
  Lock,
  AlertCircle
} from 'lucide-react';

interface SettingsData {
  profile: {
    visibility: 'public' | 'local' | 'private';
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
    allowDirectContact: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reviewAlerts: boolean;
    endorsementRequests: boolean;
    trustScoreChanges: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    profileIndexing: boolean;
    analyticsTracking: boolean;
    dataSharing: boolean;
  };
  account: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem('backendToken');
      if (!token) {
        router.push('/login');
        return;
      }
      // Basic token format validation
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        localStorage.removeItem('backendToken');
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      router.push('/login');
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('backendToken')}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('backendToken');
          router.push('/login');
          return;
        }
        throw new Error(`Failed to load settings: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load settings');
      }
      
      setSettings(result.data);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('backendToken')}`,
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('backendToken');
          router.push('/login');
          return;
        }
        throw new Error(`Failed to save settings: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to save settings');
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  // Don't render anything until authentication is checked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Error Loading Settings</h3>
                <p className="text-sm">{error}</p>
                <button
                  onClick={loadSettings}
                  className="mt-2 text-sm text-red-800 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No settings data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Settings</h1>
              <p className="text-gray-600">Manage your profile visibility and notification preferences</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Visibility Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Visibility</h2>
            </div>
            
            <div className="space-y-6">
              {/* Visibility Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Visibility Level
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={settings?.profile.visibility === 'public'}
                      onChange={(e) => updateSetting('profile', 'visibility', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Public</div>
                      <div className="text-sm text-gray-600">Visible to everyone in search results</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="local"
                      checked={settings?.profile.visibility === 'local'}
                      onChange={(e) => updateSetting('profile', 'visibility', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Local Only</div>
                      <div className="text-sm text-gray-600">Visible only to people in your area</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={settings?.profile.visibility === 'private'}
                      onChange={(e) => updateSetting('profile', 'visibility', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Private</div>
                      <div className="text-sm text-gray-600">Only visible via direct link</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Contact Information Display
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Show Phone Number</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.profile.showPhone || false}
                      onChange={(e) => updateSetting('profile', 'showPhone', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Show Email Address</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.profile.showEmail || false}
                      onChange={(e) => updateSetting('profile', 'showEmail', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Show Full Address</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.profile.showAddress || false}
                      onChange={(e) => updateSetting('profile', 'showAddress', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Allow Direct Contact</span>
                    <input
                      type="checkbox"
                      checked={settings?.profile.allowDirectContact || false}
                      onChange={(e) => updateSetting('profile', 'allowDirectContact', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Methods
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.emailNotifications || false}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">SMS Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.smsNotifications || false}
                      onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Alert Types
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">New Reviews</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.reviewAlerts || false}
                      onChange={(e) => updateSetting('notifications', 'reviewAlerts', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Endorsement Requests</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.endorsementRequests || false}
                      onChange={(e) => updateSetting('notifications', 'endorsementRequests', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Trust Score Changes</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.trustScoreChanges || false}
                      onChange={(e) => updateSetting('notifications', 'trustScoreChanges', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Weekly Reports</span>
                    <input
                      type="checkbox"
                      checked={settings?.notifications.weeklyReports || false}
                      onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700">Search Engine Indexing</div>
                  <div className="text-sm text-gray-500">Allow search engines to index your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.privacy.profileIndexing || false}
                  onChange={(e) => updateSetting('privacy', 'profileIndexing', e.target.checked)}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700">Analytics Tracking</div>
                  <div className="text-sm text-gray-500">Allow TrustNet to track profile analytics</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.privacy.analyticsTracking || false}
                  onChange={(e) => updateSetting('privacy', 'analyticsTracking', e.target.checked)}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700">Data Sharing</div>
                  <div className="text-sm text-gray-500">Share anonymized data for platform improvements</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.privacy.dataSharing || false}
                  onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>

            {!settings?.privacy.analyticsTracking && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Analytics Disabled</h4>
                    <p className="text-sm text-yellow-700">
                      Disabling analytics will prevent you from seeing detailed visitor insights in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.account.twoFactorEnabled || false}
                  onChange={(e) => updateSetting('account', 'twoFactorEnabled', e.target.checked)}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700">Login Alerts</div>
                  <div className="text-sm text-gray-500">Get notified of new login attempts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.account.loginAlerts || false}
                  onChange={(e) => updateSetting('account', 'loginAlerts', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700 font-medium">Change Password</div>
                  <div className="text-sm text-gray-500">Update your account password</div>
                </div>
                <Link
                  href="/account/change-password"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Your Settings</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Profile Visibility:</strong> Controls who can find and view your business profile in search results and recommendations.
            </p>
            <p>
              <strong>Notifications:</strong> Stay updated about customer interactions and important account activities.
            </p>
            <p>
              <strong>Privacy:</strong> Manage how your data is used while maintaining the core functionality of TrustNet.
            </p>
            <p>
              <strong>Security:</strong> Additional protection measures to keep your account safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}