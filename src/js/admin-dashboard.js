/**
 * admin-dashboard.js
 * Premium dynamic rendering for TechGear Admin - Aurora Theme
 * Now with real order tracking from localStorage
 */

function loadDashboard() {
  const user = auth.getCurrentUser();
  const adminNameElem = document.getElementById('admin-name');
  if (adminNameElem) adminNameElem.textContent = user.name.toUpperCase();

  // 1. Get Real Orders
  const orders = getOrdersFromStorage();
  const users = auth.getAllUsers();
  const contacts = StorageHelper.get('techgear_contacts', []);

  // Calculate totals from REAL orders
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;

  // Update stat cards
  updateElem('total-users', totalUsers);
  updateElem('total-contacts', contacts.length);

  // Add total orders stat
  const ordersStatEl = document.getElementById('total-orders');
  if (ordersStatEl) {
    ordersStatEl.textContent = totalOrders;
  }

  // Add total revenue stat
  const revenueStatEl = document.getElementById('total-revenue');
  if (revenueStatEl) {
    revenueStatEl.textContent = '$' + totalRevenue.toFixed(2);
  }

  // 2. Populate Users Table
  const usersTable = document.getElementById('users-table');
  if (usersTable) {
    usersTable.innerHTML = users.length === 0
      ? '<tr><td colspan="4" class="py-10 text-center opacity-50">NO NODES DETECTED</td></tr>'
      : users.map(u => `
                <tr class="border-b border-white/5 hover:bg-white/5 transition group">
                  <td class="py-5 px-2">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        <div>
                            <div class="font-black text-white tracking-widest text-xs uppercase">${u.name}</div>
                            <div class="text-[10px] opacity-40 lowercase font-mono">${u.email}</div>
                        </div>
                    </div>
                  </td>
                  <td class="py-5 px-2">
                    <span class="text-[10px] font-black tracking-[0.2em] px-2 py-1 bg-accent/10 text-accent rounded">${u.role.toUpperCase()}</span>
                  </td>
                  <td class="py-5 px-2">
                    <div class="text-[10px] uppercase font-mono tracking-tighter opacity-60">${formatDate(u.createdAt)}</div>
                  </td>
                  <td class="py-5 px-2">
                    <div class="text-[10px] uppercase font-mono tracking-tighter text-accent">${u.lastLogin ? timeAgo(u.lastLogin) : 'INITIAL_SYNC'}</div>
                  </td>
                </tr>
            `).join('');
  }

  // 3. Populate Recent Orders (NEW)
  renderRecentOrders(orders);
}
  const recentContacts = document.getElementById('recent-contacts');
  if (recentContacts) {
    recentContacts.innerHTML = contacts.length === 0
      ? '<p class="text-[10px] tracking-widest opacity-30 italic">SILENCE ON FREQUENCY</p>'
      : contacts.slice(-3).reverse().map(c => `
                <div class="bg-white/5 p-5 rounded-xl border border-white/5 group hover:border-accent/30 transition-all duration-500">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-black text-[10px] text-accent uppercase tracking-widest">${c.name}</h4>
                        <span class="text-[8px] text-muted font-mono uppercase">${timeAgo(c.date)}</span>
                    </div>
                    <p class="text-[10px] text-secondary leading-relaxed border-l border-accent/20 pl-3">${c.message || c.subject}</p>
                </div>
            `).join('');
  }

  // 4. Populate Subscribers (Newsletter)
  const recentNotifications = document.getElementById('recent-notifications');
  if (recentNotifications) {
    recentNotifications.innerHTML = notifications.length === 0
      ? '<p class="text-[10px] tracking-widest opacity-30 italic">NO NEW SIGNALS</p>'
      : notifications.slice(-3).reverse().map(n => `
                <div class="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                    <p class="text-[10px] font-mono lowercase opacity-70">${n.email}</p>
                    <div class="w-1.5 h-1.5 rounded-full bg-accent opacity-50 group-hover:opacity-100 shadow-accent"></div>
                </div>
            `).join('');
  }

  // 5. Populate Telemetry Logs
  const logsContainer = document.getElementById('full-activity-logs');
  if (logsContainer) {
    const allLogs = ActivityLogger.getAll();
    logsContainer.innerHTML = allLogs.length === 0
      ? '<p class="text-[10px] tracking-widest opacity-30 italic">LOG_BUFFER_EMPTY</p>'
      : allLogs.slice(-10).reverse().map(log => `
                <div class="flex items-center gap-4 py-2 border-b border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                    <span class="font-mono text-accent text-[8px] w-24 shrink-0">[${timeAgo(log.timestamp).toUpperCase()}]</span>
                    <span class="font-black uppercase tracking-widest text-[9px] w-32 shrink-0">${log.action}</span>
                    <span class="text-secondary font-mono text-[9px] truncate">USR: ${log.userName || 'ANON'} :: ${JSON.stringify(log.details)}</span>
                </div>
            `).join('');
  }
}

function updateElem(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ===== ORDER MANAGEMENT =====
function getOrdersFromStorage() {
  try {
    const orders = localStorage.getItem('voltgear_orders');
    return orders ? JSON.parse(orders) : [];
  } catch (e) {
    console.error('Failed to load orders:', e);
    return [];
  }
}

function renderRecentOrders(orders) {
  // Find and populate the orders table
  const ordersTable = document.getElementById('orders-table');
  if (!ordersTable) return;

  if (orders.length === 0) {
    ordersTable.innerHTML = '<tr><td colspan="4" class="py-10 text-center opacity-50">NO ORDERS YET</td></tr>';
    return;
  }

  ordersTable.innerHTML = orders.slice(-10).reverse().map(order => `
    <tr class="border-b border-white/5 hover:bg-white/5 transition group">
      <td class="py-4 px-2">
        <span class="font-mono text-[10px] text-accent uppercase tracking-tighter">${order.id}</span>
      </td>
      <td class="py-4 px-2">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <div>
            <div class="text-[10px] font-black text-white uppercase tracking-widest">${order.shippingAddress.fullName}</div>
            <div class="text-[8px] opacity-40 lowercase font-mono">${order.shippingAddress.email}</div>
          </div>
        </div>
      </td>
      <td class="py-4 px-2">
        <span class="text-[10px] font-black text-accent tracking-widest">$${order.total.toFixed(2)}</span>
      </td>
      <td class="py-4 px-2">
        <span class="text-[10px] font-outfit uppercase tracking-widest px-2 py-1 rounded ${getOrderStatusColor(order.status)}">
          ${order.status}
        </span>
      </td>
    </tr>
  `).join('');
}

function getOrderStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'text-yellow-400';
    case 'processing':
      return 'text-blue-400';
    case 'completed':
      return 'text-green-400';
    case 'cancelled':
      return 'text-red-400';
    default:
      return 'text-secondary';
  }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.protectRoute('admin')) return;
  loadDashboard();
});
