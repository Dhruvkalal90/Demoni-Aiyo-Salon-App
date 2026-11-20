'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Camera, Check, ChevronDown, ChevronRight, Clock3, Crown, Scissors, CircleHelp, CreditCard, LayoutDashboard, ListChecks, Menu, MoreHorizontal, Plus, RotateCcw, Search, Settings2, ShieldCheck, Sparkles, Trash2, UserRound, Users, Wallet, X } from 'lucide-react'

type Role = 'Owner' | 'Barber' | 'Customer'
type Section = 'Overview' | 'Live queue' | 'Team' | 'History' | 'Payments' | 'Services' | 'Settings' | 'My token' | 'Profile'

const clients = [
  { token: '024', name: 'Marcus Chen', service: 'Signature fade + beard', barber: 'Andre Wilson', chair: 'Chair 02', wait: 'Now serving', status: 'In service', initials: 'MC', color: 'rose' },
  { token: '025', name: 'Jordan Ellis', service: 'Low taper fade', barber: 'Malik Johnson', chair: 'Chair 01', wait: '8 min', status: 'Up next', initials: 'JE', color: 'gold' },
  { token: '026', name: 'Alex Rivera', service: 'Classic cut', barber: 'Andre Wilson', chair: 'Chair 02', wait: '24 min', status: 'Waiting', initials: 'AR', color: 'blue' },
  { token: '027', name: 'Sam Parker', service: 'Texture + style', barber: 'Chris Moore', chair: 'Chair 03', wait: '38 min', status: 'Waiting', initials: 'SP', color: 'green' },
]
const team = [
  { name: 'Andre Wilson', role: 'Master barber', status: 'Busy', service: 'Signature fade', done: 8, initials: 'AW', color: 'rose' },
  { name: 'Malik Johnson', role: 'Senior barber', status: 'Free', service: 'Ready for next', done: 6, initials: 'MJ', color: 'gold' },
  { name: 'Chris Moore', role: 'Stylist', status: 'Busy', service: 'Texture + style', done: 5, initials: 'CM', color: 'blue' },
  { name: 'David Brooks', role: 'Barber', status: 'On break', service: 'Back at 2:30 PM', done: 4, initials: 'DB', color: 'green' },
]
const navigation: Record<Role, Section[]> = {
  Owner: ['Overview', 'Live queue', 'Team', 'Payments', 'Services', 'Settings'],
  Barber: ['Overview', 'Live queue', 'History', 'Profile'],
  Customer: ['Overview', 'Live queue', 'My token', 'Profile'],
}
const icons = { Overview: LayoutDashboard, 'Live queue': ListChecks, Team: Users, History: CalendarDays, Payments: Wallet, Services: Scissors, Settings: Settings2, 'My token': CalendarDays, Profile: UserRound }

function mobileNavLabel(role: Role, section: Section) {
  if (role === 'Customer' && section === 'Overview') return 'Home'
  if (role === 'Customer' && section === 'Live queue') return 'Live Queue'
  if (role === 'Customer' && section === 'My token') return 'My Token'
  if (role === 'Barber' && section === 'Overview') return 'Dashboard'
  if (role === 'Barber' && section === 'Live queue') return 'Queue'
  return section
}

function MetricCard({ title, value, note, icon: Icon, trend, accent }: { title: string; value: string; note: string; icon: typeof Users; trend?: string; accent?: boolean }) {
  return <article className="metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${accent ? 'accent' : ''}`}><Icon size={17} /></span></div><div className="metric-value">{value}</div><div className="metric-note">{trend && <span className="trend"><ArrowUpRight size={13} />{trend}</span>}{note}</div></article>
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'Busy' || status === 'In service' ? 'status-red' : status === 'Free' || status === 'Completed' ? 'status-green' : status === 'Up next' ? 'status-gold' : 'status-muted'
  return <span className={`status-badge ${cls}`}><i />{status}</span>
}

function QueueTable({ query }: { query: string }) {
  const filtered = clients.filter((client) => `${client.name} ${client.token} ${client.service}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Assigned barber</th><th>Est. wait</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((client) => <tr key={client.token}><td><div className="customer-cell"><span className={`avatar ${client.color}`}>{client.initials}</span><span><strong>{client.name}</strong><small>Token #{client.token}</small></span></div></td><td>{client.service}</td><td><strong className="table-strong">{client.barber}</strong><small className="table-sub">{client.chair}</small></td><td className="wait-cell">{client.wait}</td><td><StatusBadge status={client.status} /></td><td><button className="icon-button" aria-label={`More options for ${client.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No queue entries match that search.</div>}</div>
}

function OwnerOverview({ onQueue }: { onQueue: () => void }) {
  return <>
    <section className="welcome-banner"><div className="welcome-copy"><span className="eyebrow"><span className="live-dot" /> SAMPLE SALON STATUS</span><h2>Good afternoon, Demoni.</h2><p>Your shop is in rhythm. Here&apos;s what&apos;s happening today.</p><div className="welcome-meta"><span><Clock3 size={14} /> Open until 8:00 PM</span><span className="meta-divider" /><span>Sample dashboard</span></div></div><div className="banner-art" aria-hidden="true"><img src="/salon-crest.png" alt="" /></div><button onClick={onQueue} className="banner-link">View live queue <ChevronRight size={15} /></button></section>
    <section className="metric-grid" aria-label="Today's salon metrics"><MetricCard title="Customers today" value="38" note="vs. yesterday" trend="12%" icon={Users} /><MetricCard title="In the queue" value="04" note="~ 24 min average wait" icon={Clock3} accent /><MetricCard title="Services completed" value="26" note="68% of daily target" trend="8%" icon={Scissors} /><MetricCard title="Revenue today" value="$1,284" note="3 payments pending" trend="16%" icon={Wallet} /></section>
    <section className="content-grid"><article className="panel queue-panel"><div className="panel-heading"><div><span className="eyebrow">RIGHT NOW</span><h3>Live queue <span className="live-pill sample-pill">SAMPLE</span></h3><p>Keep an eye on every chair and every client.</p></div><button className="text-action" onClick={onQueue}>Full queue <ChevronRight size={15} /></button></div><QueueTable query="" /><div className="panel-footer"><span>Showing <b>4</b> of <b>4</b> active tokens</span><button onClick={onQueue}>Manage queue <ArrowUpRight size={14} /></button></div></article><aside className="panel team-panel"><div className="panel-heading compact"><div><span className="eyebrow">YOUR CREW</span><h3>Team on shift</h3></div><button className="icon-button" aria-label="Team options"><MoreHorizontal size={18} /></button></div><div className="team-list">{team.map((person) => <div className="team-member" key={person.name}><span className={`avatar ${person.color}`}>{person.initials}</span><div className="member-info"><strong>{person.name}</strong><small>{person.service}</small></div><StatusBadge status={person.status} /></div>)}</div><div className="team-summary"><div className="team-summary-top"><span>Chair availability</span><b>3 / 4</b></div><div className="chair-bar"><span /></div><div className="team-summary-bottom"><span>3 active</span><span>1 on break</span></div></div><button className="outline-button full-width"><Plus size={15} /> Add team member</button></aside></section>
    <section className="bottom-grid"><article className="panel activity-panel"><div className="panel-heading compact"><div><span className="eyebrow">TODAY&apos;S PULSE</span><h3>Service activity</h3></div><button className="select-button">Today <ChevronDown size={14} /></button></div><div className="chart-wrap"><div className="chart-y"><span>12</span><span>8</span><span>4</span><span>0</span></div><div className="chart-main"><div className="chart-lines"><i /><i /><i /><i /></div><div className="chart-bars">{[35, 58, 42, 82, 63, 100, 71, 48, 68, 43, 77, 52].map((height, index) => <div className="bar-pair" key={index}><span style={{ height: `${height}%` }} /><span style={{ height: `${Math.max(14, height * .48)}%` }} /></div>)}</div><div className="chart-x"><span>9 AM</span><span>11 AM</span><span>1 PM</span><span>3 PM</span><span>5 PM</span><span>7 PM</span></div></div></div><div className="chart-legend"><span><i className="legend-red" /> Haircuts</span><span><i className="legend-gold" /> Styling</span><span className="chart-total"><b>26</b> services today</span></div></article><article className="panel services-panel"><div className="panel-heading compact"><div><span className="eyebrow">TOP PERFORMER</span><h3>This week</h3></div><Sparkles size={18} className="gold-icon" /></div><div className="performer"><span className="performer-avatar">AW</span><div><strong>Andre Wilson</strong><small>Master barber · 42 services</small></div><span className="performer-score">#1</span></div><div className="performer-stats"><div><span>Revenue</span><b>$1,860</b></div><div><span>Rating</span><b>4.9 <span className="star">★</span></b></div></div><div className="service-share"><div className="service-share-heading"><span>Popular service</span><b>Signature fade</b></div><div className="share-track"><i /></div><small>32% of all services this week</small></div></article></section>
  </>
}

function QueueView({ query, setQuery, onToken }: { query: string; setQuery: (value: string) => void; onToken: () => void }) {
  return <><div className="view-intro"><div><span className="eyebrow">SAMPLE QUEUE DATA</span><h2>Live queue</h2><p>Every token, every chair, all in one place.</p></div><button className="primary-button" onClick={onToken}><Plus size={16} /> Create token</button></div><div className="queue-summary-grid"><div><span>Active tokens</span><b>04</b><small>Across 3 chairs</small></div><div><span>Currently serving</span><b>01</b><small>Andre · Chair 02</small></div><div><span>Average wait</span><b>24 <em>min</em></b><small>Sample estimate</small></div></div><div className="panel full-queue"><div className="panel-heading"><div><span className="eyebrow">FRIDAY, NOVEMBER 20</span><h3>Today&apos;s tokens</h3></div><label className="search-box"><Search size={16} /><input aria-label="Search queue" placeholder="Search customers..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><QueueTable query={query} /></div><div className="queue-note"><ShieldCheck size={17} /><span>Sample queue preview only. Connect a backend for real-time queue updates.</span></div></>
}

function TeamView() {
  return <><div className="view-intro"><div><span className="eyebrow">THE PEOPLE BEHIND THE CRAFT</span><h2>Your team</h2><p>Manage your barbers, availability, and today&apos;s service load.</p></div><button className="primary-button"><Plus size={16} /> Add team member</button></div><div className="team-card-grid">{team.map((person) => <article className="panel person-card" key={person.name}><div className="person-card-top"><span className={`avatar avatar-large ${person.color}`}>{person.initials}</span><button className="icon-button" aria-label={`Options for ${person.name}`}><MoreHorizontal size={18} /></button></div><h3>{person.name}</h3><p>{person.role}</p><StatusBadge status={person.status} /><div className="person-separator" /><div className="person-detail"><span>Today&apos;s services</span><b>{person.done}</b></div><div className="person-detail"><span>Current assignment</span><b>{person.service}</b></div></article>)}</div></>
}

function PaymentsView() {
  return <><div className="view-intro"><div><span className="eyebrow">MANUAL PAYMENT TRACKING</span><h2>Payments</h2><p>Record payments in the salon. No online checkout is enabled.</p></div><button className="outline-button"><CalendarDays size={15} /> Today <ChevronDown size={14} /></button></div><div className="metric-grid"><MetricCard title="Collected today" value="$1,284" note="32 transactions" icon={Wallet} accent /><MetricCard title="Pending payments" value="$126" note="3 services awaiting payment" icon={CreditCard} /><MetricCard title="Paid services" value="32" note="84% of today&apos;s customers" icon={Check} /><MetricCard title="Unpaid services" value="03" note="Follow up at reception" icon={CircleHelp} /></div><article className="panel payment-table"><div className="panel-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Payment records</h3></div><button className="select-button">All statuses <ChevronDown size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Token</th><th>Customer</th><th>Service</th><th>Amount</th><th>Received by</th><th>Status</th></tr></thead><tbody>{[{ token: '023', name: 'Taylor Reed', service: 'Classic cut', amount: '$38', receiver: 'Reception', status: 'Paid' }, { token: '022', name: 'Drew Morgan', service: 'Fade + beard', amount: '$62', receiver: 'Salon owner', status: 'Paid' }, { token: '021', name: 'Casey Lee', service: 'Hair treatment', amount: '$48', receiver: '—', status: 'Pending' }, { token: '020', name: 'Riley James', service: 'Texture + style', amount: '$55', receiver: 'Reception', status: 'Paid' }].map((row) => <tr key={row.token}><td>#{row.token}</td><td><strong className="table-strong">{row.name}</strong></td><td>{row.service}</td><td className="wait-cell">{row.amount}</td><td>{row.receiver}</td><td><StatusBadge status={row.status} /></td></tr>)}</tbody></table></div></article></>
}

function ServicesView() {
  const services = [{ name: 'Signature haircut', category: 'Hair cutting', price: '$38', time: '35 min', icon: Scissors }, { name: 'Fade + beard', category: 'Hair cutting', price: '$62', time: '55 min', icon: Scissors }, { name: 'Texture & style', category: 'Hair styling', price: '$48', time: '45 min', icon: Sparkles }, { name: 'Deep conditioning', category: 'Hair treatment', price: '$55', time: '50 min', icon: Activity }]
  return <><div className="view-intro"><div><span className="eyebrow">YOUR MENU</span><h2>Services</h2><p>Thoughtfully crafted services, clear prices, and honest timing.</p></div><button className="primary-button"><Plus size={16} /> Add service</button></div><div className="service-card-grid">{services.map(({ name, category, price, time, icon: Icon }) => <article className="panel service-card" key={name}><span className="service-icon"><Icon size={19} /></span><span className="eyebrow">{category}</span><h3>{name}</h3><div className="service-details"><span><Clock3 size={14} />{time}</span><b>{price}</b></div></article>)}</div><div className="queue-note"><CircleHelp size={17} /><span>Service durations are used to estimate customer wait times. Actual times may vary.</span></div></>
}

function SettingsView() {
  return <><div className="view-intro"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Salon settings</h2><p>Operating hours, queue rules, and the details your clients see.</p></div><button className="primary-button"><Check size={16} /> Save changes</button></div><div className="settings-grid"><article className="panel settings-card"><span className="settings-icon"><Clock3 size={18} /></span><h3>Operating hours</h3><p>Set when clients can join your queue.</p><div className="setting-row"><span>Opening time</span><b>9:00 AM <ChevronDown size={14} /></b></div><div className="setting-row"><span>Closing time</span><b>8:00 PM <ChevronDown size={14} /></b></div><div className="setting-row"><span>Last token cutoff</span><b>7:15 PM <ChevronDown size={14} /></b></div></article><article className="panel settings-card"><span className="settings-icon"><ShieldCheck size={18} /></span><h3>Queue policies</h3><p>Give every customer a fair, predictable visit.</p><div className="setting-row"><span>Cancellation window</span><b>15 minutes</b></div><div className="setting-row"><span>Late arrival grace</span><b>10 minutes</b></div><div className="setting-row"><span>Finish service minimum</span><b>15 minutes</b></div></article></div></>
}

function CustomerOverview({ onToken }: { onToken: () => void }) {
  return <><div className="customer-brand-banner"><img src="/salon-banner.png" alt="Demoni Aiyo Salon — Your Style, Our Craft" /></div><section className="customer-welcome"><div><span className="eyebrow"><span className="live-dot" /> YOUR NEIGHBORHOOD BARBERSHOP</span><h2>Your style, your time.</h2><p>Skip the endless waiting. Join the queue from anywhere.</p><button className="primary-button" onClick={onToken}>Get your token <ChevronRight size={16} /></button></div><img src="/salon-crest.png" alt="Demoni Aiyo Salon illustrated crest" /></section><div className="customer-quick-stats"><div><span>People waiting</span><b>3</b><small>Across 3 barbers</small></div><div><span>Estimated wait</span><b>24 <em>min</em></b><small>Sample preview</small></div><div><span>Today&apos;s hours</span><b>9–8</b><small>Open until 8:00 PM</small></div></div><div className="customer-section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h3>Find your fresh</h3></div><button className="text-action">All services <ChevronRight size={15} /></button></div><div className="customer-service-grid">{[{ title: 'Hair cutting', description: 'A clean cut, made yours.', price: 'from $32', icon: Scissors }, { title: 'Hair styling', description: 'Make a statement.', price: 'from $28', icon: Sparkles }, { title: 'Hair texture', description: 'Bring out your natural.', price: 'from $45', icon: Activity }, { title: 'Hair treatment', description: 'A little care goes far.', price: 'from $40', icon: ShieldCheck }].map(({ title, description, price, icon: Icon }) => <button className="customer-service" key={title} onClick={onToken}><span className="service-icon"><Icon size={19} /></span><strong>{title}</strong><small>{description}</small><span className="service-price">{price} <ChevronRight size={13} /></span></button>)}</div><div className="customer-live-queue"><div><span className="eyebrow">SAMPLE QUEUE</span><h3>Good things take a little time.</h3><p>3 guests ahead · around 24 minutes</p></div><button className="outline-button" onClick={onToken}>Track queue <ArrowUpRight size={15} /></button></div></>
}

type CustomerQueueStatus = 'waiting' | 'approaching' | 'called' | 'in_service' | 'completed' | 'cancelled'

type CustomerQueueDemo = {
  token: string
  customerName: string
  services: string[]
  barber: string
  barberInitials: string
  chair: string
  status: CustomerQueueStatus
  customersAhead: number
  estimatedWaitMinutes: number | null
  currentlyServingToken: string
  createdAt: number
  updatedAt: number
}

function createInitialCustomerQueue(): CustomerQueueDemo {
  const now = Date.now()
  return { token: '026', customerName: 'Jordan Ellis', services: ['Classic cut'], barber: 'Malik Johnson', barberInitials: 'MJ', chair: 'Chair 01', status: 'waiting', customersAhead: 3, estimatedWaitMinutes: 24, currentlyServingToken: '024', createdAt: now, updatedAt: now }
}

const queueStatusCopy: Record<CustomerQueueStatus, string> = {
  waiting: 'Waiting in queue', approaching: 'Almost your turn', called: 'Your turn is now', in_service: 'Service in progress', completed: 'Service complete', cancelled: 'Token cancelled',
}

function CustomerQueueView({ queue, tokenCreated, onToken, onAdvance }: { queue: CustomerQueueDemo; tokenCreated: boolean; onToken: () => void; onAdvance: () => void }) {
  const ready = queue.status === 'called'
  const progress = queue.status === 'waiting' ? 25 : queue.status === 'approaching' ? 60 : queue.status === 'called' || queue.status === 'in_service' ? 88 : 100
  return <div className="customer-queue-view">
    <div className="view-intro"><div><span className="eyebrow">QUEUE SNAPSHOT · SAMPLE DATA</span><h2>Live queue</h2><p>Follow your place and see who&apos;s serving.</p></div><button className="primary-button" onClick={onToken}><Plus size={16} /> {!tokenCreated || queue.status === 'cancelled' || queue.status === 'completed' ? 'Get a token' : 'My token'}</button></div>
    {ready && <div className="get-ready-alert" role="status"><span className="ready-alert-icon"><Bell size={19} /></span><div><strong>GET READY</strong><p>Your barber is ready. Head to {queue.chair} now.</p></div><span className="ready-live-dot" /> </div>}
    <section className="customer-token-hero panel"><div className="customer-token-main"><div><span className="eyebrow">YOUR TOKEN · {queueStatusCopy[queue.status].toUpperCase()}</span><div className="customer-big-token"><span>#</span>{queue.token}</div><p>{queue.customerName} · {queue.services.join(' + ')}</p></div><div className="customer-token-status"><StatusBadge status={ready ? 'Up next' : queue.status === 'in_service' ? 'In service' : queue.status === 'completed' ? 'Completed' : queue.status === 'cancelled' ? 'Cancelled' : 'Waiting'} /></div></div><div className="customer-token-facts"><div><span>Customers ahead</span><b>{queue.customersAhead}</b></div><div><span>Estimated wait</span><b>{queue.estimatedWaitMinutes === null ? '—' : `${queue.estimatedWaitMinutes} min`}</b></div><div><span>Now serving</span><b>#{queue.currentlyServingToken}</b></div></div><div className="customer-assignment"><span className="avatar gold">{queue.barberInitials}</span><div><small>YOUR BARBER</small><b>{queue.barber}</b></div><span className="assignment-divider" /><div><small>YOUR CHAIR</small><b>{queue.chair}</b></div></div></section>
    <section className="panel customer-timeline-panel"><div className="panel-heading compact"><div><span className="eyebrow">QUEUE PROGRESS</span><h3>Your visit, step by step</h3></div><span className="queue-position">{queue.status === 'cancelled' ? 'Cancelled' : queue.status === 'completed' ? 'Done' : `${queue.customersAhead + 1} in line`}</span></div><div className="customer-progress-track" aria-label={`Queue progress ${progress}%`}><span style={{ width: `${progress}%` }} /></div><div className="customer-queue-timeline">{[
      { key: 'confirmed', label: 'Token confirmed', detail: 'You are on the list', done: true },
      { key: 'waiting', label: 'Waiting in queue', detail: queue.status === 'waiting' ? `${queue.customersAhead} customers ahead` : 'Your place is moving forward', done: ['approaching', 'called', 'in_service', 'completed'].includes(queue.status), current: queue.status === 'waiting' },
      { key: 'called', label: 'Barber calls your token', detail: queue.status === 'called' ? 'Head to your assigned chair' : 'We’ll show a GET READY alert when called', done: ['in_service', 'completed'].includes(queue.status), current: queue.status === 'called' },
      { key: 'service', label: 'Service', detail: queue.status === 'completed' ? 'Visit complete' : 'Your barber starts your service', done: queue.status === 'completed', current: queue.status === 'in_service' },
    ].map((step) => <div className={`customer-timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`} key={step.key}><i>{step.done ? <Check size={12} /> : null}</i><div><b>{step.label}</b><small>{step.detail}</small></div></div>)}</div>
    </section>
    <div className="queue-demo-controls"><button className="outline-button" onClick={onAdvance} disabled={['completed', 'cancelled'].includes(queue.status)}>Advance sample queue event <ChevronRight size={15} /></button><span>Demo only · advances on action, not on a countdown.</span></div>
    <div className="queue-note"><ShieldCheck size={17} /><span>Sample queue snapshot; values change only with demo events. This object is shaped for a future Realtime queue subscription.</span></div>
  </div>
}

function HistoryView() {
  const visits = [
    { date: 'Today · 10:42 AM', customer: 'Jordan Ellis', service: 'Low taper fade', token: '#024', status: 'Completed' },
    { date: 'Yesterday · 3:18 PM', customer: 'Taylor Reed', service: 'Classic cut', token: '#019', status: 'Completed' },
    { date: 'Nov 18 · 11:05 AM', customer: 'Drew Morgan', service: 'Fade + beard', token: '#014', status: 'Completed' },
    { date: 'Nov 17 · 1:30 PM', customer: 'Casey Lee', service: 'Texture + style', token: '#011', status: 'Completed' },
  ]

  return <>
    <div className="view-intro"><div><span className="eyebrow">YOUR RECENT WORK</span><h2>Service history</h2><p>A quick look at the clients you&apos;ve taken care of.</p></div><button className="outline-button"><CalendarDays size={15} /> Recent visits</button></div>
    <div className="queue-summary-grid"><div><span>Services today</span><b>6</b><small>Sample history</small></div><div><span>This week</span><b>28</b><small>Sample history</small></div><div><span>Average rating</span><b>4.9</b><small>Sample history</small></div></div>
    <article className="panel payment-table history-table"><div className="panel-heading"><div><span className="eyebrow">RECENT SERVICES</span><h3>Completed visits</h3></div></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Token</th><th>Completed</th><th>Status</th></tr></thead><tbody>{visits.map((visit) => <tr key={visit.token}><td><strong className="table-strong">{visit.customer}</strong></td><td>{visit.service}</td><td>{visit.token}</td><td>{visit.date}</td><td><StatusBadge status={visit.status} /></td></tr>)}</tbody></table></div></article>
    <div className="queue-note"><CircleHelp size={17} /><span>Service history shown here is sample data.</span></div>
  </>
}

function TokenView({ tokenCreated, booking, queue, onToken, onCancel, onAdvance }: { tokenCreated: boolean; booking: TokenBooking | null; queue: CustomerQueueDemo; onToken: () => void; onCancel: () => void; onAdvance: () => void }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(interval)
  }, [])
  const cancelDeadline = queue.createdAt + 15 * 60 * 1000
  const cancellationOpen = ['waiting', 'approaching'].includes(queue.status) && now < cancelDeadline
  const cancelDeadlineLabel = new Date(cancelDeadline).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const queuePercent = queue.status === 'waiting' ? 25 : queue.status === 'approaching' ? 60 : ['called', 'in_service'].includes(queue.status) ? 88 : 100
  const badgeStatus = queue.status === 'called' ? 'Up next' : queue.status === 'in_service' ? 'In service' : queue.status === 'completed' ? 'Completed' : queue.status === 'cancelled' ? 'Cancelled' : 'Waiting'
  return <div className="token-layout customer-token-screen">
    <div className="view-intro"><div><span className="eyebrow">YOUR PLACE IN THE CHAIR</span><h2>{queue.status === 'cancelled' ? 'Token cancelled' : queue.status === 'completed' ? 'Visit complete' : 'You’re in the queue.'}</h2><p>{queue.status === 'called' ? `Your barber is ready. Head to ${queue.chair}.` : queue.status === 'in_service' ? 'Your service is underway.' : 'Your queue details, updated with each sample event.'}</p></div><StatusBadge status={badgeStatus} /></div>
    {queue.status === 'called' && <div className="get-ready-alert" role="alert"><span className="ready-alert-icon"><Bell size={19} /></span><div><strong>GET READY</strong><p>Your turn is now. Please head to {queue.chair}.</p></div><span className="ready-live-dot" /></div>}
    <section className="token-card panel customer-token-hero"><div className="token-card-top"><div><span className="eyebrow">DEMONI AIYO SALON · TODAY</span><p>YOUR TOKEN</p></div><span className="live-pill sample-pill">SAMPLE QUEUE</span></div><div className="customer-big-token customer-big-token-centered"><span>#</span>{queue.token}</div><div className="customer-token-facts"><div><span>Customers ahead</span><b>{queue.customersAhead}</b></div><div><span>Estimated wait</span><b>{queue.estimatedWaitMinutes === null ? '—' : `${queue.estimatedWaitMinutes} min`}</b></div><div><span>Now serving</span><b>#{queue.currentlyServingToken}</b></div></div><div className="customer-assignment"><span className="avatar gold">{queue.barberInitials}</span><div><small>ASSIGNED BARBER</small><b>{queue.barber}</b></div><span className="assignment-divider" /><div><small>ASSIGNED CHAIR</small><b>{queue.chair}</b></div></div>{booking && tokenCreated && <div className="token-application-details"><div><span>Requested services</span><b>{booking.services.join(', ')}</b></div><div><span>Service category</span><b>{booking.category}</b></div><div><span>Estimated price</span><b>${booking.totalPrice}</b></div></div>}
      <div className="token-progress"><div><span>QUEUE PROGRESS</span><b>{queue.status === 'cancelled' ? 'Cancelled' : queue.status === 'completed' ? 'Complete' : `${queue.customersAhead + 1} in line`}</b></div><div className="progress-track"><i style={{ width: `${queuePercent}%` }} /></div><small>Sample estimate · changes with queue events, not a timer.</small></div>
    </section>
    <section className="panel customer-timeline-panel token-screen-timeline"><div className="panel-heading compact"><div><span className="eyebrow">YOUR QUEUE TIMELINE</span><h3>What happens next</h3></div><span className="queue-position">{queueStatusCopy[queue.status]}</span></div><div className="customer-queue-timeline">{[
      { key: 'confirmed', label: 'Token confirmed', detail: 'You are on the list', done: true },
      { key: 'waiting', label: 'Waiting in queue', detail: `${queue.customersAhead} customers ahead`, done: ['approaching', 'called', 'in_service', 'completed'].includes(queue.status), current: queue.status === 'waiting' },
      { key: 'called', label: 'Barber calls your token', detail: queue.status === 'called' ? `Head to ${queue.chair} now` : 'GET READY alert appears here', done: ['in_service', 'completed'].includes(queue.status), current: queue.status === 'called' },
      { key: 'service', label: 'Service', detail: queue.status === 'completed' ? 'Visit complete' : 'Your barber starts your service', done: queue.status === 'completed', current: queue.status === 'in_service' },
    ].map((step) => <div className={`customer-timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`} key={step.key}><i>{step.done ? <Check size={12} /> : null}</i><div><b>{step.label}</b><small>{step.detail}</small></div></div>)}</div></section>
    <section className="customer-cancellation panel"><div><span className="eyebrow">CANCELLATION POLICY</span><p>{cancellationOpen ? `Cancellation is available until ${cancelDeadlineLabel} (the first 15 minutes after joining).` : queue.status === 'cancelled' ? 'This sample token has been cancelled.' : 'The 15-minute cancellation window has closed or your turn has been called.'}</p></div><button className="cancel-button" disabled={!cancellationOpen} onClick={onCancel}>{cancellationOpen ? 'Cancel token' : 'Cancellation unavailable'}</button></section>
    <div className="queue-demo-controls"><button className="outline-button" onClick={queue.status === 'cancelled' || queue.status === 'completed' ? onToken : onAdvance}>{queue.status === 'cancelled' || queue.status === 'completed' ? 'Join a new queue' : 'Advance sample queue event'} <ChevronRight size={15} /></button><span>Prototype event controls · queue data is structured for a future Supabase Realtime subscription.</span></div>
    <div className="queue-note"><ShieldCheck size={17} /><span>Wait estimates and queue position are sample snapshots, not live or countdown data.</span></div>
  </div>
}

function LegacyTokenView({ tokenCreated, booking, onToken, onCancel }: { tokenCreated: boolean; booking: TokenBooking | null; onToken: () => void; onCancel: () => void }) {
  const requestedServices = booking?.services.join(', ')
  return <div className="token-layout"><div className="view-intro"><div><span className="eyebrow">YOUR PLACE IN THE CHAIR</span><h2>{tokenCreated ? 'You’re in the queue.' : 'My token'}</h2><p>{tokenCreated ? 'Your barber will be ready for you soon.' : 'Your next great cut is just around the corner.'}</p></div>{tokenCreated && <StatusBadge status="Waiting" />}</div><div className="token-card panel"><div className="token-card-top"><div><span className="eyebrow">DEMONI AIYO SALON · TODAY</span><p>YOUR TOKEN</p></div><span className="live-pill sample-pill">SAMPLE QUEUE</span></div><div className="token-number">#<span>{tokenCreated ? '028' : '026'}</span></div><div className="token-meta"><div><span>Estimated wait</span><b>{tokenCreated ? '~ 32 min' : '~ 24 min'}</b></div><div><span>Customers ahead</span><b>{tokenCreated ? '4 guests' : '3 guests'}</b></div><div><span>Service</span><b>{tokenCreated ? requestedServices || 'Signature cut' : 'Classic cut'}</b></div></div>{tokenCreated && booking && <div className="token-application-details"><div><span>Category</span><b>{booking.category}</b></div><div><span>Price estimate</span><b>${booking.totalPrice}</b></div><div><span>Service duration</span><b>~ {booking.durationMinutes} min</b></div><div><span>Barber review</span><b>Pending confirmation</b></div></div>}<div className="token-progress"><div><span>QUEUE PROGRESS</span><b>1 of 5</b></div><div className="progress-track"><i /></div><small>We&apos;ll let you know when you&apos;re up next.</small></div><div className="called-bar"><span className="avatar gold">MJ</span><div><small>YOUR BARBER</small><b>Malik Johnson · Chair 01</b></div><span className="barber-ready"><i /> Available</span></div><div className="timeline"><div className="timeline-item done"><i><Check size={12} /></i><div><b>Token confirmed</b><small>You&apos;re on the list</small></div><time>Now</time></div><div className="timeline-item current"><i /><div><b>Waiting for your turn</b><small>3 customers ahead of you</small></div><time>~24 min</time></div><div className="timeline-item"><i /><div><b>Head to the chair</b><small>We&apos;ll notify you when you&apos;re next</small></div></div><div className="timeline-item"><i /><div><b>Your fresh cut</b><small>Enjoy the craft</small></div></div></div><button className="cancel-button" onClick={onCancel}>Cancel token</button><p className="cancellation-note">Cancellations are unavailable within 15 minutes of your turn.</p></div></div>
}

type TokenBooking = {
  category: string
  services: string[]
  customerName: string
  phone: string
  totalPrice: number
  durationMinutes: number
  hasReferencePhoto: boolean
}

type TokenCategoryId = 'haircut' | 'beard' | 'texture' | 'combo'

type TokenServiceOption = {
  id: string
  category: TokenCategoryId
  name: string
  description: string
  price: number
  minutes: number
}

const tokenCategories = [
  { id: 'haircut', name: 'Cuts & fades', description: 'Fresh cuts and clean edges', icon: Scissors },
  { id: 'beard', name: 'Beard & grooming', description: 'Shape, detail, and finish', icon: ShieldCheck },
  { id: 'texture', name: 'Texture & care', description: 'Style and care for your texture', icon: Sparkles },
  { id: 'combo', name: 'Combo services', description: 'A complete, coordinated look', icon: Plus },
] as const

const tokenServiceOptions: TokenServiceOption[] = [
  { id: 'signature-cut', category: 'haircut', name: 'Signature haircut', description: 'Classic, tailored to you', price: 38, minutes: 35 },
  { id: 'low-taper', category: 'haircut', name: 'Low taper fade', description: 'Clean edges, easy living', price: 42, minutes: 40 },
  { id: 'classic-cut', category: 'haircut', name: 'Classic cut', description: 'A timeless shape and finish', price: 32, minutes: 30 },
  { id: 'shape-up', category: 'haircut', name: 'Shape-up detail', description: 'Add a crisp line-up', price: 12, minutes: 10 },
  { id: 'beard-shaping', category: 'beard', name: 'Beard styling', description: 'Shape and define your beard', price: 24, minutes: 20 },
  { id: 'hot-towel', category: 'beard', name: 'Hot towel beard trim', description: 'A close trim with a warm finish', price: 32, minutes: 25 },
  { id: 'line-up', category: 'beard', name: 'Clean line-up', description: 'A quick, precise outline', price: 18, minutes: 15 },
  { id: 'texture-style', category: 'texture', name: 'Texture & style', description: 'Bring your natural texture to life', price: 48, minutes: 45 },
  { id: 'curl-definition', category: 'texture', name: 'Curl definition', description: 'Define and shape your curls', price: 30, minutes: 25 },
  { id: 'deep-condition', category: 'texture', name: 'Deep conditioning', description: 'A restorative care treatment', price: 40, minutes: 30 },
  { id: 'fade-beard', category: 'combo', name: 'Fade + beard', description: 'A coordinated cut and beard finish', price: 62, minutes: 55 },
  { id: 'cut-texture', category: 'combo', name: 'Cut + texture finish', description: 'A tailored cut with styled texture', price: 68, minutes: 70 },
]

const tokenStepTitles = ['Choose a service category.', 'Pick your service options.', 'Review your estimate.', 'Preview your hairstyle check.', 'Confirm your request.']
const tokenStepDescriptions = [
  'Start with the kind of service you have in mind. You can change this before applying.',
  'Choose one or more services or details. Your estimate updates as you select.',
  'Review your estimated price and time, then add your contact details.',
  'Add a current hairstyle photo for a clearly labelled mock assessment. This demo does not run AI.',
  'Check the details before applying. Your barber will confirm feasibility and final pricing in person.',
]

function TokenFlow({ onClose, onComplete }: { onClose: () => void; onComplete: (booking: TokenBooking) => void }) {
  const [step, setStep] = useState(1)
  const [categoryId, setCategoryId] = useState<TokenCategoryId>('haircut')
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [name, setName] = useState('Jordan Ellis')
  const [phone, setPhone] = useState('(415) 555-0142')
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null)
  const [photoWarning, setPhotoWarning] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const category = tokenCategories.find((item) => item.id === categoryId) ?? tokenCategories[0]
  const availableOptions = tokenServiceOptions.filter((option) => option.category === categoryId)
  const selectedOptions = tokenServiceOptions.filter((option) => selectedOptionIds.includes(option.id))
  const totalPrice = selectedOptions.reduce((sum, option) => sum + option.price, 0)
  const durationMinutes = selectedOptions.reduce((sum, option) => sum + option.minutes, 0)
  const phoneDigits = phone.replace(/\D/g, '')
  const contactIsValid = name.trim().length > 0 && phoneDigits.length >= 10
  const canContinue = step !== 2 || selectedOptions.length > 0
  const canReview = step !== 3 || contactIsValid

  useEffect(() => {
    if (!referencePhoto) return
    return () => URL.revokeObjectURL(referencePhoto)
  }, [referencePhoto])

  const toggleOption = (optionId: string) => {
    setSelectedOptionIds((current) => current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId])
  }

  const chooseCategory = (nextCategory: TokenCategoryId) => {
    setCategoryId(nextCategory)
    setSelectedOptionIds([])
  }

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoWarning('Choose an image file to preview your hairstyle reference.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoWarning('That image is larger than 10 MB. Choose a smaller photo.')
      return
    }
    setPhotoWarning('')
    setReferencePhoto(URL.createObjectURL(file))
  }

  const applyForToken = () => {
    onComplete({
      category: category.name,
      services: selectedOptions.map((option) => option.name),
      customerName: name.trim(),
      phone: phone.trim(),
      totalPrice,
      durationMinutes,
      hasReferencePhoto: Boolean(referencePhoto),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="token-modal" role="dialog" aria-modal="true" aria-labelledby="token-flow-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close token application"><X size={18} /></button>
        <div className="modal-brand"><img src="/salon-crest.png" alt="" /><span>DEMONI AIYO <b>SALON</b></span></div>
        <div className="step-indicator" role="list" aria-label={`Application progress: step ${step} of 5`}>
          {tokenStepTitles.map((title, index) => (
            <span key={title} role="listitem" className={step >= index + 1 ? 'active' : ''} aria-current={step === index + 1 ? 'step' : undefined} aria-label={`Step ${index + 1}: ${title}`} title={title}>{String(index + 1).padStart(2, '0')}</span>
          )).flatMap((indicator, index) => index < tokenStepTitles.length - 1 ? [indicator, <i key={`step-line-${index}`} aria-hidden="true" />] : [indicator])}
        </div>
        <span className="eyebrow">STEP {step} OF 5 · {tokenStepTitles[step - 1].replace(/[.]/g, '')}</span>
        <h2 id="token-flow-title">{tokenStepTitles[step - 1]}</h2>
        <p className="modal-description">{tokenStepDescriptions[step - 1]}</p>

        {step === 1 && (
          <div className="service-category-grid" role="group" aria-label="Service categories">
            {tokenCategories.map(({ id, name: label, description, icon: Icon }) => (
              <button key={id} type="button" className={`service-category ${categoryId === id ? 'selected' : ''}`} aria-pressed={categoryId === id} onClick={() => chooseCategory(id)}>
                <span className="option-icon"><Icon size={17} /></span>
                <span className="service-category-copy"><b>{label}</b><small>{description}</small></span>
                {categoryId === id && <Check size={16} className="option-check" />}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="service-selection">
            <div className="selection-heading"><span>{category.name}</span><small>Choose any that apply</small></div>
            <div className="selection-live-summary" aria-live="polite"><span>Current estimate</span><b>${totalPrice} <i>·</i> {durationMinutes} min</b></div>
            <div className="service-option-list">
              {availableOptions.map((option) => {
                const isSelected = selectedOptionIds.includes(option.id)
                return (
                  <button key={option.id} type="button" className={`service-option ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} onClick={() => toggleOption(option.id)}>
                    <span className="option-icon"><Scissors size={16} /></span>
                    <span className="service-option-copy"><b>{option.name}</b><small>{option.description}</small><small>{option.minutes} min</small></span>
                    <strong>${option.price}</strong>
                    {isSelected && <Check size={16} className="option-check" />}
                  </button>
                )
              })}
            </div>
            <p className="selection-hint">You can select multiple options. Each adds to the estimate.</p>
          </div>
        )}

        {step === 3 && (
          <div className="estimate-step">
            <div className="booking-summary live-booking-summary">
              <div><span>Category</span><b>{category.name}</b></div>
              <div><span>Selected services</span><b>{selectedOptions.map((option) => option.name).join(', ')}</b></div>
              <div><span>Estimated service duration</span><b>~ {durationMinutes} min</b></div>
              <div className="summary-total"><span>Estimated price</span><b>${totalPrice}</b></div>
              <p><Clock3 size={14} /> Duration and price are estimates; your barber confirms both before service.</p>
            </div>
            <div className="customer-fields">
              <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
              <label>Mobile number<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" aria-describedby="contact-hint" /></label>
              {!contactIsValid && <small className="contact-warning" id="contact-hint">Enter your name and a valid phone number to continue.</small>}
              {contactIsValid && <div className="field-note"><ShieldCheck size={15} /> We&apos;ll only use this to update you about your token.</div>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="ai-check-panel">
            <input ref={photoInputRef} className="visually-hidden-input" type="file" accept="image/*" capture="environment" aria-label="Choose or capture a hairstyle reference photo" onChange={handlePhoto} />
            {referencePhoto ? (
              <div className="photo-preview-card">
                <img className="reference-preview" src={referencePhoto} alt="Hairstyle reference photo preview" />
                <div className="photo-preview-copy"><b>Reference photo added</b><small>Preview only. It is not sent to a server.</small>
                  <div className="photo-actions"><button type="button" className="back-button" onClick={() => photoInputRef.current?.click()}><RotateCcw size={14} /> Retake</button><button type="button" className="back-button remove-photo" onClick={() => setReferencePhoto(null)}><Trash2 size={14} /> Remove</button></div>
                </div>
              </div>
            ) : (
              <button type="button" className="photo-dropzone" onClick={() => photoInputRef.current?.click()}><span className="option-icon"><Camera size={19} /></span><b>Add a hairstyle photo</b><small>Take a photo or choose one from your device</small><span className="photo-cta">Choose photo</span></button>
            )}
            {photoWarning && <p className="photo-warning" role="alert"><AlertTriangle size={15} /> {photoWarning}</p>}
            <div className="ai-assessment" aria-labelledby="mock-assessment-title">
              <span className="eyebrow"><Sparkles size={13} /> MOCK ASSESSMENT · UI ONLY</span>
              <h3 id="mock-assessment-title">Hairstyle assessment</h3>
              <p>No AI model is connected. This screen is a mock interface and does not analyze your photo.</p>
              <div className="assessment-grid">
                <div><span>Style preferences</span><b>{selectedOptions.map((option) => option.name).join(', ')}</b><small>Selected by you · not a recommendation</small></div>
                <div><span>Feasibility status</span><b className="feasibility-unverified">Unverified</b><small>Barber review required</small></div>
                <div className="assessment-confirmation"><span>Barber confirmation</span><b>Pending</b><small>Your barber will confirm the style in person</small></div>
              </div>
              <div className="assessment-warning" role="note"><AlertTriangle size={15} /><span>Warning: this mock assessment is not professional advice. Final feasibility, service time, and price must be confirmed by your barber.</span></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="confirmation-step">
            <div className="booking-summary">
              <div><span>Service category</span><b>{category.name}</b></div>
              <div><span>Service options</span><b>{selectedOptions.map((option) => option.name).join(', ')}</b></div>
              <div><span>Customer</span><b>{name.trim()}</b></div>
              <div><span>Mobile</span><b>{phone.trim()}</b></div>
              <div><span>Reference photo</span><b>{referencePhoto ? 'Added · preview only' : 'Not added'}</b></div>
              <div><span>Estimated duration</span><b>~ {durationMinutes} min</b></div>
              <div className="summary-total"><span>Estimated total</span><b>${totalPrice}</b></div>
            </div>
            <div className="confirmation-note"><ShieldCheck size={16} /><span>Barber confirmation is still required. Your barber will review the request and confirm feasibility, time, and final price.</span></div>
            <div className="mock-disclaimer"><Sparkles size={14} /><span>AI assessment is a mock UI only. No AI analysis was performed.</span></div>
          </div>
        )}

        <div className="modal-actions">
          {step > 1 && <button type="button" className="back-button" onClick={() => setStep(step - 1)}>Back</button>}
          <button type="button" className="primary-button" disabled={!canContinue || !canReview} onClick={() => step === 5 ? applyForToken() : setStep(step + 1)}>{step === 5 ? 'Apply for token' : step === 4 ? 'Continue to review' : 'Continue'} <ChevronRight size={16} /></button>
        </div>
        <p className="modal-footnote">Preview flow only. Queue details use sample data.</p>
      </section>
    </div>
  )
}

function BarberFlow() {
  const [status, setStatus] = useState<'FREE' | 'BUSY' | 'NOT AVAILABLE'>('FREE')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [calledAt, setCalledAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [completed, setCompleted] = useState(false)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const elapsedSeconds = startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0
  const elapsedLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`
  const noShowReady = calledAt !== null && now - calledAt >= 10 * 60 * 1000
  const serviceReady = startedAt !== null && elapsedSeconds >= 15 * 60
  const startService = () => {
    if (status !== 'FREE' || startedAt) return
    setStartedAt(Date.now())
    setStatus('BUSY')
  }
  const finishService = () => {
    if (!serviceReady) return
    setCompleted(true)
    setStartedAt(null)
    setCalledAt(null)
    setStatus('FREE')
  }
  const skipCustomer = () => {
    if (!noShowReady || !window.confirm('Skip Jordan Ellis for not arriving? This removes the customer from the active queue.')) return
    setSkipped(true)
    setCalledAt(null)
    setStatus('FREE')
  }

  return <><section className="welcome-banner barber-banner"><div className="welcome-copy"><span className="eyebrow"><span className="live-dot" /> YOUR CHAIR · {status}</span><h2>Ready when you are, Malik.</h2><p>{completed ? 'Jordan Ellis has completed their visit.' : skipped ? 'The called customer was skipped.' : startedAt ? 'You are currently serving Jordan Ellis.' : 'Jordan Ellis is up next with a low taper fade.'}</p><div className="welcome-meta"><span><Scissors size={14} /> Chair 01</span><span className="meta-divider" /><span>{startedAt ? `Elapsed ${elapsedLabel}` : 'Estimated 35 min'}</span></div></div><button className="barber-start" disabled={status !== 'FREE' || !!startedAt || completed || skipped} onClick={startService}><Scissors size={16} /> Start service</button></section><section className="metric-grid"><MetricCard title="Services today" value={completed ? '07' : '06'} note="2 more than yesterday" trend="14%" icon={Scissors} /><MetricCard title="Current status" value={status} note={status === 'FREE' ? 'Available for next client' : status === 'BUSY' ? 'Service in progress' : 'Unavailable for assignments'} icon={Activity} accent /><MetricCard title="Service timer" value={startedAt ? elapsedLabel : '—'} note={startedAt ? 'Minimum service: 15:00' : 'Starts when service begins'} icon={Clock3} /><MetricCard title="Your rating" value="4.9" note="From 128 reviews" icon={Crown} /></section><section className="content-grid"><article className="panel barber-next"><div className="panel-heading"><div><span className="eyebrow">{skipped ? 'CUSTOMER SKIPPED' : completed ? 'SERVICE COMPLETE' : 'UP NEXT · TOKEN #025'}</span><h3>Your next client</h3><p>Review the request before getting started.</p></div><StatusBadge status={startedAt ? 'In service' : completed ? 'Completed' : skipped ? 'Waiting' : 'Up next'} /></div><div className="next-client"><span className="avatar avatar-large gold">JE</span><div><h3>Jordan Ellis</h3><p>Low taper fade · Est. 35 min</p><span className="client-arrival"><Clock3 size={14} /> {calledAt ? `Called ${Math.floor((now - calledAt) / 60000)} min ago` : 'Arriving now'}</span></div></div><div className="client-details"><div><span>Requested services</span><b>Low taper fade · Shape-up</b></div><div><span>Assigned chair</span><b>Chair 01</b></div><div><span>AI assessment</span><b>Mock only · Barber review</b></div></div><div className="client-details"><div><span>Reference photo</span><img src="/hairstyle-reference.png" alt="Customer hairstyle reference: low taper fade with short textured curls" style={{ width: '100%', maxWidth: 180, borderRadius: 7, marginTop: 7 }} /></div><div><span>Request notes</span><b>Keep length on top; clean low taper</b></div><div><span>AI assessment</span><b>Style request captured; feasibility unverified</b></div></div>{startedAt && <p className="field-note" role="status"><Clock3 size={15} /> Service started at {new Date(startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · elapsed {elapsedLabel}</p>}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}><button className="primary-button" disabled={status !== 'FREE' || !!startedAt || completed || skipped} onClick={startService}>Start service <ChevronRight size={16} /></button>{startedAt && <button className="primary-button" disabled={!serviceReady} onClick={finishService}>Finish service</button>}{!calledAt && !startedAt && !completed && !skipped && <button className="outline-button" onClick={() => setCalledAt(Date.now())}>Call customer</button>}{calledAt && !startedAt && !skipped && <button className="outline-button" disabled={!noShowReady} onClick={skipCustomer}>{noShowReady ? 'Confirm skip customer' : `No-show warning in ${Math.max(0, 10 - Math.floor((now - calledAt) / 60000))} min`}</button>}</div>{startedAt && !serviceReady && <small className="selection-hint">Finish service unlocks after 15 minutes ({Math.max(0, 15 - Math.floor(elapsedSeconds / 60))} min remaining). This client-side timer is prototype-only.</small>}{noShowReady && !skipped && <p className="contact-warning" role="alert"><AlertTriangle size={14} /> Jordan has not arrived after 10 minutes. Confirm skip to advance the queue.</p>}<p className="queue-note"><ShieldCheck size={15} /> Prototype logic only: status, timer, no-show threshold, and queue changes are local UI state. Enforce durations, queue transitions, and authorization on a trusted backend in production.</p></article><aside className="panel team-panel"><div className="panel-heading compact"><div><span className="eyebrow">YOUR AVAILABILITY</span><h3>Chair status</h3></div></div><div className="barber-shift"><div><span>Current chair</span><b>Chair 01</b></div><div><span>Service status</span><b>{status}</b></div></div><div style={{ display: 'grid', gap: 8 }}><button className="outline-button full-width" disabled={!!startedAt} onClick={() => setStatus(status === 'NOT AVAILABLE' ? 'FREE' : 'NOT AVAILABLE')}>{status === 'NOT AVAILABLE' ? 'Set available' : 'Set not available'}</button><button className="outline-button full-width" disabled={!!startedAt} onClick={() => setStatus(status === 'BUSY' ? 'FREE' : 'BUSY')}>{status === 'BUSY' ? 'Set free' : 'Set busy'}</button></div></aside></section></>
}

export default function SalonPlatform() {
  const [role, setRole] = useState<Role>('Owner')
  const [section, setSection] = useState<Section>('Overview')
  const [query, setQuery] = useState('')
  const [tokenFlow, setTokenFlow] = useState(false)
  const [tokenCreated, setTokenCreated] = useState(false)
  const [tokenBooking, setTokenBooking] = useState<TokenBooking | null>(null)
  const [queueDemo, setQueueDemo] = useState<CustomerQueueDemo>(createInitialCustomerQueue)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = useMemo(() => navigation[role], [role])
  const mobileNavItems: Section[] = role === 'Customer' ? ['Overview', 'Live queue', 'My token', 'Profile'] : role === 'Barber' ? ['Overview', 'Live queue', 'History', 'Profile'] : []
  const switchRole = (next: Role) => { setRole(next); setSection(next === 'Customer' ? 'Overview' : 'Overview'); setSidebarOpen(false) }
  const createToken = (booking: TokenBooking) => {
    const now = Date.now()
    setQueueDemo({ token: '028', customerName: booking.customerName, services: booking.services, barber: 'Malik Johnson', barberInitials: 'MJ', chair: 'Chair 01', status: 'waiting', customersAhead: 3, estimatedWaitMinutes: 24, currentlyServingToken: '024', createdAt: now, updatedAt: now })
    setTokenBooking(booking)
    setTokenCreated(true)
    setTokenFlow(false)
    setSection('My token')
    setNotice('Your token #028 is confirmed. You’re in the queue!')
    window.setTimeout(() => setNotice(''), 4500)
  }
  const advanceQueueDemo = () => setQueueDemo((queue) => {
    const next: Partial<CustomerQueueDemo> = queue.status === 'waiting'
      ? { status: 'approaching', customersAhead: 1, estimatedWaitMinutes: 8, currentlyServingToken: '025' }
      : queue.status === 'approaching'
        ? { status: 'called', customersAhead: 0, estimatedWaitMinutes: 0, currentlyServingToken: queue.token }
        : queue.status === 'called'
          ? { status: 'in_service', customersAhead: 0, estimatedWaitMinutes: 0, currentlyServingToken: queue.token }
          : queue.status === 'in_service'
            ? { status: 'completed', customersAhead: 0, estimatedWaitMinutes: null, currentlyServingToken: '027' }
            : {}
    return Object.keys(next).length ? { ...queue, ...next, updatedAt: Date.now() } : queue
  })
  const openQueue = () => setSection('Live queue')
  const renderContent = () => {
    if (section === 'Live queue') return role === 'Customer' ? <CustomerQueueView queue={queueDemo} tokenCreated={tokenCreated} onToken={() => tokenCreated ? setSection('My token') : setTokenFlow(true)} onAdvance={advanceQueueDemo} /> : <QueueView query={query} setQuery={setQuery} onToken={() => setTokenFlow(true)} />
    if (section === 'Team') return <TeamView />
    if (section === 'History') return <HistoryView />
    if (section === 'Payments') return <PaymentsView />
    if (section === 'Services') return <ServicesView />
    if (section === 'Settings') return <SettingsView />
    if (section === 'My token') return <TokenView tokenCreated={tokenCreated} booking={tokenBooking} queue={queueDemo} onAdvance={advanceQueueDemo} onToken={() => setTokenFlow(true)} onCancel={() => { setQueueDemo((queue) => ({ ...queue, status: 'cancelled', estimatedWaitMinutes: null, updatedAt: Date.now() })); setNotice('Your sample token has been cancelled.'); window.setTimeout(() => setNotice(''), 3500) }} />
    if (section === 'Profile') return <div className="panel profile-view"><span className="avatar avatar-large rose">{role === 'Customer' ? 'JE' : 'DA'}</span><span className="eyebrow">YOUR ACCOUNT</span><h2>{role === 'Customer' ? 'Jordan Ellis' : role === 'Barber' ? 'Malik Johnson' : 'Demoni Aiyo'}</h2><p>{role} account · Member since 2024</p><button className="outline-button">Edit profile</button></div>
    if (role === 'Customer') return <CustomerOverview onToken={() => setTokenFlow(true)} />
    if (role === 'Barber' && section === 'Overview') return <BarberFlow />
    if (role === 'Barber') return <><section className="welcome-banner barber-banner"><div className="welcome-copy"><span className="eyebrow"><span className="live-dot" /> YOUR CHAIR IS OPEN</span><h2>Ready when you are, Malik.</h2><p>Jordan Ellis is up next with a low taper fade.</p><div className="welcome-meta"><span><Scissors size={14} /> Chair 01</span><span className="meta-divider" /><span>Estimated 35 min</span></div></div><button className="barber-start" onClick={() => setNotice('Service started · Finish is available after 15 minutes.')}><Scissors size={16} /> Start service</button></section><section className="metric-grid"><MetricCard title="Services today" value="06" note="2 more than yesterday" trend="14%" icon={Scissors} /><MetricCard title="Current status" value="FREE" note="Available for next client" icon={Activity} accent /><MetricCard title="Clients served" value="06" note="Your daily goal is 8" icon={Users} /><MetricCard title="Your rating" value="4.9" note="From 128 reviews" icon={Crown} /></section><section className="content-grid"><article className="panel barber-next"><div className="panel-heading"><div><span className="eyebrow">UP NEXT · TOKEN #025</span><h3>Your next client</h3><p>Give them a warm welcome and a fresh start.</p></div><StatusBadge status="Up next" /></div><div className="next-client"><span className="avatar avatar-large gold">JE</span><div><h3>Jordan Ellis</h3><p>Low taper fade · Est. 35 min</p><span className="client-arrival"><Clock3 size={14} /> Arriving now</span></div></div><div className="client-details"><div><span>Requested service</span><b>Low taper fade</b></div><div><span>Reference photo</span><b>Not provided</b></div><div><span>AI style check</span><b>Not requested</b></div></div><button className="primary-button" onClick={() => setNotice('Service started · Finish is available after 15 minutes.')}>Start service <ChevronRight size={16} /></button></article><aside className="panel team-panel"><div className="panel-heading compact"><div><span className="eyebrow">YOUR SHIFT</span><h3>At a glance</h3></div></div><div className="barber-shift"><div><span>Shift</span><b>9:00 AM – 6:00 PM</b></div><div><span>Chair</span><b>Chair 01</b></div><div><span>Next break</span><b>2:30 PM · 15 min</b></div><div><span>Queue behind you</span><b>2 clients</b></div></div><button className="outline-button full-width" onClick={() => setNotice('Status changed to unavailable.')}>Set unavailable</button></aside></section></>
    return <OwnerOverview onQueue={openQueue} />
  }
  const viewLabel = section === 'Overview' ? role === 'Customer' ? 'Your salon, your way' : role === 'Barber' ? 'Barber workspace' : 'Salon overview' : section
  return <main className="salon-app"><aside id="salon-sidebar" className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}><div className="brand-lockup"><div className="brand-mark"><img src="/salon-crest.png" alt="" /></div><div><strong>DEMONI AIYO</strong><span>S A L O N</span></div><button className="mobile-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div><div className="salon-location"><span className="location-mark"><Scissors size={15} /></span><span><b>Demoni Aiyo Salon</b><small>San Francisco, CA</small></span><ChevronDown size={14} /></div><div className="nav-caption">WORKSPACE</div><nav className="side-nav" aria-label="Main navigation">{navItems.map((item) => { const Icon = icons[item]; return <button key={item} onClick={() => { setSection(item); setSidebarOpen(false) }} className={`nav-item ${section === item ? 'nav-active' : ''}`} aria-current={section === item ? 'page' : undefined}><Icon size={17} /><span>{item}</span>{item === 'Live queue' && <span className="nav-count">4</span>}</button> })}</nav><div className="sidebar-bottom"><div className="support-card"><div className="support-icon"><CircleHelp size={17} /></div><b>Need a hand?</b><p>We&apos;re here to help your shop run smoothly.</p><button onClick={() => setNotice('Support request panel coming soon.')}>Visit help center <ArrowUpRight size={13} /></button></div><button className="account-button"><span className="avatar account-avatar">DA</span><span><b>Demoni Aiyo</b><small>Salon owner</small></span><MoreHorizontal size={18} /></button></div></aside><div className={`sidebar-scrim ${sidebarOpen ? 'scrim-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
  <section className="workspace"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="salon-sidebar"><Menu size={20} /></button><div className="breadcrumb"><span>Demoni Aiyo Salon</span><ChevronRight size={14} /><b>{viewLabel}</b></div></div><div className="topbar-actions"><label className="role-switch"><span>Viewing as</span><select aria-label="Switch user role" value={role} onChange={(event) => switchRole(event.target.value as Role)}><option>Owner</option><option>Barber</option><option>Customer</option></select><ChevronDown size={13} /></label><button className="top-icon-button" aria-label="Notifications" onClick={() => setNotice('You’re all caught up on notifications.')}><Bell size={18} /><i /></button><span className="top-avatar">DA</span></div></header><div className="page-content">{renderContent()}<footer className="app-footer"><span>© 2026 Demoni Aiyo Salon</span><span><span className="live-dot" /> Preview data · connect a backend for live updates</span><button onClick={() => setNotice('Support request panel coming soon.')}>Help & support</button></footer></div>{mobileNavItems.length > 0 && <nav className="mobile-bottom-nav" aria-label={`${role} navigation`}>{mobileNavItems.map((item) => { const Icon = icons[item]; return <button key={item} className={section === item ? 'mobile-nav-active' : ''} aria-current={section === item ? 'page' : undefined} onClick={() => setSection(item)}><Icon size={18} /><span>{mobileNavLabel(role, item)}</span></button> })}</nav>}</section>{tokenFlow && <TokenFlow onClose={() => setTokenFlow(false)} onComplete={createToken} />}{notice && <div className="toast-message" role="status"><span className="toast-check"><Check size={15} /></span>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}</main>
}
