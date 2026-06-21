import { useAuthStore } from '../../auth/stores/authStore';
import { Mail, Building2, Link as LinkIcon, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import { GithubIcon } from '../../../components/icons/GithubIcon';
import { LinkedinIcon } from '../../../components/icons/LinkedinIcon';
import { axiosClient } from '../../../lib/axiosClient';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const WEBSITE_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;

const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+(\/?)$/;

const LINKEDIN_REGEX =
  /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/in\/[a-zA-Z0-9_%à-ỹÀ-Ỹ-]+\/?$/;

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.accessToken);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [displayName, setDisplayName] = useState(user?.username ?? 'Guest');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [workplace, setWorkplace] = useState(user?.workplace ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');

  const getSocialLink = (platform: string) =>
    user?.socialLinks?.find(
      (l) => l.platform.toLowerCase() === platform.toLowerCase(),
    )?.url || '';

  const [linkedinUrl, setLinkedinUrl] = useState(getSocialLink('linkedin'));
  const [githubUrl, setGithubUrl] = useState(getSocialLink('github'));
  const [websiteUrl, setWebsiteUrl] = useState(getSocialLink('website'));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials =
    (user?.username ?? 'Guest')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'G';

  const [imageError, setImageError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{
    displayName?: string;
    websiteUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (file) {
      // Prevent uploading assets larger than 5MB
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user || !token) return;

    const errors: typeof formErrors = {};

    // 1. Name Check: Ensure it is not left empty or completely blanked out with whitespace
    if (!displayName || displayName.trim() === '') {
      errors.displayName = 'Name cannot be empty or contain only spaces.';
    }

    // 2. Personal Website Check: Ensure formatting conforms to a typical web URL structure
    if (websiteUrl && !WEBSITE_REGEX.test(websiteUrl)) {
      errors.websiteUrl = 'Please enter a valid URL.';
    }

    // 3. GitHub Profile URL Check: Enforce a true profile address pattern
    if (githubUrl && !GITHUB_REGEX.test(githubUrl)) {
      errors.githubUrl =
        'Please enter a valid GitHub profile URL (e.g., github.com/username).';
    }

    // 4. LinkedIn Profile URL Check: Enforce an exact member account path matching scheme
    if (linkedinUrl && !LINKEDIN_REGEX.test(linkedinUrl)) {
      errors.linkedinUrl =
        'Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const socialLinks = [];
      if (githubUrl)
        socialLinks.push({ platform: 'github', url: githubUrl.trim() });
      if (linkedinUrl)
        socialLinks.push({ platform: 'linkedin', url: linkedinUrl.trim() });
      if (websiteUrl)
        socialLinks.push({ platform: 'website', url: websiteUrl.trim() });

      const payload = {
        username: displayName.trim(),
        avatarUrl,
        bio,
        workplace,
        socialLinks,
      };

      const response = await axiosClient.put('/user/profile', payload);
      login(token, { ...user, ...response });
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.username ?? 'Guest');
    setBio(user?.bio ?? '');
    setWorkplace(user?.workplace ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
    setLinkedinUrl(getSocialLink('linkedin'));
    setGithubUrl(getSocialLink('github'));
    setWebsiteUrl(getSocialLink('website'));
    setImageError('');
    setFormErrors({});
    setIsEditMode(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageError('');
  };

  if (isEditMode) {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div
              className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden shrink-0 border border-gray-200"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-fuchsia-400 to-violet-400 flex items-center justify-center text-white text-4xl font-semibold">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full"
              >
                Remove
              </button>
            )}
          </div>
          {imageError && (
            <p className="text-xs text-red-500 font-medium">{imageError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-800">Name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`pl-3 py-2 ${formErrors.displayName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {formErrors.displayName && (
            <p className="text-xs text-red-500 font-medium mt-0.5">
              {formErrors.displayName}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-800">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself..."
            className="w-full border border-primary-mid focus:border-primary focus:ring-primary rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition bg-card text-fg placeholder-fg-muted min-h-[80px]"
            maxLength={160}
          />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-gray-400 min-w-[20px]" />
            <Input
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              placeholder="Company or University"
              className="pl-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <LinkIcon size={20} className="text-gray-400 min-w-[20px]" />
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website URL"
                className={`pl-3 py-2 w-full ${formErrors.websiteUrl ? 'border-red-500' : ''}`}
              />
            </div>
            {formErrors.websiteUrl && (
              <p className="text-xs text-red-500 font-medium ml-8">
                {formErrors.websiteUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-sm font-bold text-gray-800">
            Social accounts
          </label>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <GithubIcon size={20} className="text-gray-400 min-w-[20px]" />
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="GitHub Profile URL"
                className={`pl-3 py-2 w-full ${formErrors.githubUrl ? 'border-red-500' : ''}`}
              />
            </div>
            {formErrors.githubUrl && (
              <p className="text-xs text-red-500 font-medium ml-8">
                {formErrors.githubUrl}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <LinkedinIcon size={20} className="text-gray-400 min-w-[20px]" />
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="LinkedIn Profile URL"
                className={`pl-3 py-2 w-full ${formErrors.linkedinUrl ? 'border-red-500' : ''}`}
              />
            </div>
            {formErrors.linkedinUrl && (
              <p className="text-xs text-red-500 font-medium ml-8">
                {formErrors.linkedinUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="py-2 px-4 w-auto text-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="py-2 px-4 w-auto text-sm border border-gray-200"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-4">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user?.username}
            className="w-20 h-20 md:w-full md:max-w-[280px] md:h-auto md:aspect-square rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 md:w-full md:max-w-[280px] md:h-auto md:aspect-square rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-400 flex items-center justify-center text-white text-3xl md:text-6xl font-semibold border border-gray-200">
            {initials}
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-[#2F2F3A]">
            {user?.username ?? 'Guest'}
          </h2>
        </div>
      </div>

      <button
        onClick={() => setIsEditMode(true)}
        className="w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
      >
        Edit profile
      </button>

      {user?.bio && <p className="text-sm text-gray-700 mt-2">{user.bio}</p>}

      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        {user?.workplace && (
          <div className="flex items-center gap-2">
            <Building2 size={16} />
            <span>{user.workplace}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>{user?.email || 'No email provided'}</span>
        </div>
        {user?.socialLinks?.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            {link.platform.toLowerCase() === 'github' ? (
              <GithubIcon size={16} />
            ) : link.platform.toLowerCase() === 'linkedin' ? (
              <LinkedinIcon size={16} />
            ) : (
              <LinkIcon size={16} />
            )}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline truncate max-w-[240px]"
            >
              {link.url.replace(/^https?:\/\//, '')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
