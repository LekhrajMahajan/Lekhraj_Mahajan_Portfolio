import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowUpRight, GitFork, Users, Calendar } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';

export interface ProfileStatsCardProps {
  avatar?: string;
  name?: string;
  subtitle?: string;
  githubUrl?: string;
  githubUsername?: string;
}

interface GitHubUserResponse {
  name: string;
  public_repos: number;
  followers: number;
  avatar_url: string;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  avatar = portfolioData.skills.profileCard.avatar,
  name = portfolioData.skills.profileCard.name,
  subtitle = 'GITHUB CONTRIBUTION CALENDAR',
  githubUrl = portfolioData.skills.profileCard.githubUrl,
  githubUsername = 'LekhrajMahajan',
}) => {
  const [userData, setUserData] = useState<GitHubUserResponse | null>(null);
  const [, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const cardRef = useRef<HTMLDivElement>(null);
  const reposNumRef = useRef<HTMLElement>(null);
  const followersNumRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGitHubUser = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${githubUsername}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error('GitHub API request failed');
        }
        const data = (await res.json()) as GitHubUserResponse;
        setUserData(data);
        setStatus('ready');
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setStatus('error');
      }
    };

    fetchGitHubUser();

    return () => {
      controller.abort();
    };
  }, [githubUsername]);

  // Count-up numbers in ProfileStatsCard, triggered once on enter
  useEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) return;

    const targetRepos = userData?.public_repos ?? 20;
    const targetFollowers = userData?.followers ?? 2;

    const ctx = gsap.context(() => {
      const tracker = { repos: 0, followers: 0 };
      gsap.to(tracker, {
        repos: targetRepos,
        followers: targetFollowers,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (reposNumRef.current) {
            reposNumRef.current.textContent = String(Math.round(tracker.repos));
          }
          if (followersNumRef.current) {
            followersNumRef.current.textContent = String(Math.round(tracker.followers));
          }
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [userData]);

  // Spotlight on card borders and subtle 3D tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    gsap.to(card, {
      rotateY: normX * 5.5,
      rotateX: -normY * 5.5,
      transformPerspective: 850,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mx', '-500px');
    card.style.setProperty('--my', '-500px');
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  // Subtle magnetic attraction on icon hover
  const handleIconMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion()) return;
    const icon = e.currentTarget;
    const rect = icon.getBoundingClientRect();
    const bx = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const by = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(icon, { x: bx, y: by, duration: 0.2, ease: 'power2.out' });
  };

  const handleIconLeave = (e: React.PointerEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  };

  const statsList = useMemo(
    () => [
      {
        id: 'repos',
        label: 'Public repos',
        initialValue: userData?.public_repos != null ? String(userData.public_repos) : '20',
        icon: <GitFork size={16} strokeWidth={2.2} />,
      },
      {
        id: 'followers',
        label: 'Followers',
        initialValue: userData?.followers != null ? String(userData.followers) : '2',
        icon: <Users size={16} strokeWidth={2.2} />,
      },
      {
        id: 'graph',
        label: '365 day graph',
        initialValue: 'Live',
        icon: <Calendar size={16} strokeWidth={2.2} />,
      },
    ],
    [userData]
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        background:
          'radial-gradient(380px circle at var(--mx, -500px) var(--my, -500px), rgba(191,74,26,0.24), transparent 75%), #161616',
      }}
      className="rounded-[20px] border border-[#e5e3dc]/15 p-4 sm:p-5 text-[#e5e3dc] shadow-[0_24px_60px_rgba(22,22,22,0.25)] flex flex-col justify-start h-full transition-[border-color,box-shadow] duration-300 hover:border-[#bf4a1a]/40"
    >
      {/* Top Header Row: Avatar, Identity, External Profile Link */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar / Portrait with golden-orange ring */}
          <div className="size-12 sm:size-13 shrink-0 rounded-[15px] overflow-hidden border border-[#e5e3dc]/15 bg-[#e5e3dc]/10 p-0.5">
            <img
              src={userData?.avatar_url || avatar}
              alt={`${name} portrait`}
              width={48}
              height={48}
              className="w-full h-full object-cover object-top rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Subtitle & Name */}
          <div>
            <p className="font-['Poppins'] text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#bf4a1a]">
              {subtitle}
            </p>
            <h3 className="mt-0.5 font-['Big_Shoulders_Display',sans-serif] text-[26px] sm:text-[30px] font-bold uppercase leading-none text-[#e5e3dc] tracking-tight">
              {userData?.name || name}
            </h3>
          </div>
        </div>

        {/* GitHub Profile Button */}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full border border-[#e5e3dc]/15 bg-[#e5e3dc]/10 text-[#e5e3dc] transition-all duration-300 hover:bg-white hover:border-white hover:text-black hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Open GitHub Profile"
        >
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </a>
      </div>

      {/* Middle: 3 Verified Developer Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
        {statsList.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#e5e3dc]/10 bg-[#e5e3dc]/10 p-2.5 sm:p-3 flex flex-col justify-between"
          >
            <span
              onPointerMove={handleIconMove}
              onPointerLeave={handleIconLeave}
              className="mb-2 flex size-7 items-center justify-center rounded-lg bg-[#bf4a1a]/15 text-[#bf4a1a] cursor-default"
            >
              {stat.icon}
            </span>
            <strong
              ref={
                stat.id === 'repos'
                  ? reposNumRef
                  : stat.id === 'followers'
                  ? followersNumRef
                  : undefined
              }
              className="block font-['Poppins'] text-lg sm:text-[20px] font-bold text-[#e5e3dc] leading-none"
            >
              {stat.initialValue}
            </strong>
            <span className="mt-1 block font-['Poppins'] text-[10px] font-semibold text-[#e5e3dc]/65 leading-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Contribution Calendar Chart */}
      <div className="mt-4 rounded-xl bg-white p-2.5 sm:p-3 shadow-inner text-[#161616] overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#bf4a1a]/20 overscroll-contain">
          <img
            src={`https://ghchart.rshah.org/BF4A1A/${githubUsername}`}
            alt={`${name}'s GitHub Contribution Calendar`}
            width={650}
            height={110}
            className="w-full h-auto min-w-0 block select-none object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
