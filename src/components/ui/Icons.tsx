import React from 'react';

const Svg = ({ children, ...props }: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const IconUser = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>
);

export const IconTrade = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M3 12h6l-2-2m0 0l2-2M21 12h-6l2-2m0 0l-2-2"/><path d="M13 7v10"/></Svg>
);

export const IconMarket = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M3 3v18h18"/><path d="M7 13v6M12 9v10M17 5v14"/></Svg>
);

export const IconPositions = (props: any) => (
  <Svg width={20} height={20} {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 14l3-6 3 10 2-8"/></Svg>
);

export const IconTransactions = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/><path d="M16 3v4M8 21v-4"/></Svg>
);

export const IconFunds = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M12 1v22"/><circle cx="12" cy="12" r="6"/></Svg>
);

export const IconCopy = (props: any) => (
  <Svg width={18} height={18} {...props}><rect x="9" y="9" width="9" height="9" rx="2"/><path d="M3 15V3a2 2 0 0 1 2-2h12"/></Svg>
);

export const IconLeader = (props: any) => (
  <Svg width={20} height={20} {...props}><path d="M12 2l2.09 4.26L19 7l-3.5 3.26L16.18 15 12 12.8 7.82 15l.68-4.74L5 7l4.91-.74L12 2z"/></Svg>
);

export const IconActivity = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M3 12h3l3-8 4 16 3-10h3"/></Svg>
);

export const IconChat = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>
);

export const IconSettings = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.3 17.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.28-.41 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 6.3A2 2 0 0 1 7.12 3.47l.06.06c.48.48 1 .72 1.6.72h.18c.6 0 1.12-.24 1.6-.72l.06-.06A2 2 0 0 1 15.7 4.3l-.06.06a1.65 1.65 0 0 0-.33 1.82c.23.59.81 1 1.51 1H17a2 2 0 0 1 0 4h-.09c-.7 0-1.28.41-1.51 1-.12.33-.18.68-.18 1.03v.18c0 .35.06.7.18 1.03.23.59.81 1 1.51 1H19a2 2 0 0 1 2 2v.18z"/></Svg>
);

export const IconVerified = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M12 2l2 4 4 .6-3 2.6.8 4L12 13.4 8.2 14.8l.8-4L6 8.2 10 7.6 12 3z"/></Svg>
);

export const IconLogout = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></Svg>
);

export const IconBell = (props: any) => (
  <Svg width={18} height={18} {...props}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a1 1 0 1 0-2 0v1.083A6 6 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>
);

export default {};
