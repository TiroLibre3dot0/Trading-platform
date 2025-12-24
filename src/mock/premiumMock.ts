const premiumMock = {
  userPoints: 14178.08,
  currentTier: 'Premium',
  nextTierProgress: 42, // percent
  tiers: [
    { name: 'Premium', min: 10000, benefits: ['Priority support','Lower withdrawal fees','Exclusive webinars','Market insights','Discounted commissions'] },
    { name: 'Elite', min: 50000, benefits: ['Dedicated account manager','Priority withdrawals','Personal strategy review','Higher leverage options','Invitation-only events'] },
    { name: 'Ambassador', min: 250000, benefits: ['Bespoke strategy audits','Personal analyst','Private webinars','Highest fee discounts','Beta access to features'] }
  ]
};

export default premiumMock;
