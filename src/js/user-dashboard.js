/**
 * user-dashboard.js
 * Premium dynamic rendering for TechGear User - Aurora Theme
 * Now with user order history
 */

function loadDashboard() {
  const user = auth.getCurrentUser();
  if (!user) return;

  // fresh data
  const freshUser = auth.getAllUsers().find(u => u.id === user.id);
  const interactions = freshUser.interactions || [];

  // Get user's orders from localStorage
  const userOrders = getUserOrders(user.email);

  // Update Profile & Header
  updateElem('user-name', user.name.toUpperCase());
  updateElem('profile-name', user.name.toUpperCase());
  updateElem('profile-email', user.email.toLowerCase());
  updateElem('user-role', 'CLEARANCE_' + user.role.toUpperCase());
  updateElem('user-id', user.id.toUpperCase());

  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();

  updateElem('member-since', formatDate(user.createdAt).toUpperCase());
  updateElem('last-login', user.lastLogin ? timeAgo(user.lastLogin).toUpperCase() : 'INITIAL_SYNC');
  updateElem('activity-count', `${interactions.length} OPERATIONS`);

  // Populate user's orders
  renderUserOrders(userOrders);

  // 3. Populate Telemetry Feed
  const feed = document.getElementById('activity-feed');
  if (feed) {
    feed.innerHTML = interactions.length === 0
      ? `
                <div class="text-center py-20 opacity-30">
                  <p class="text-[10px] font-black tracking-[0.5em] mb-4">NO ACTIVITY DETECTED</p>
                  <p class="text-[8px] font-mono uppercase">Explore the collection to generate telemetry data.</p>
                </div>
            `
      : interactions.slice(0, 15).map(item => `
                <div class="flex items-center gap-6 py-4 border-b border-white/5 opacity-70 hover:opacity-100 transition-opacity group">
                  <div class="w-1.5 h-1.5 rounded-full bg-accent group-hover:shadow-accent transition-all"></div>
                  <div class="flex-grow flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <div class="font-black text-[10px] uppercase tracking-widest text-white mb-1">${item.type}</div>
                        <div class="text-[9px] font-mono text-muted uppercase tracking-tighter">${item.description || item.type}</div>
                    </div>
                    <div class="text-[8px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded">
                        SYNC_TIME: ${timeAgo(item.timestamp).toUpperCase()}
                    </div>
                  </div>
                </div>
            `).join('');
  }
}

function updateElem(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ===== ORDER MANAGEMENT =====
function getUserOrders(userEmail) {
  try {
    const orders = localStorage.getItem('voltgear_orders');
    const allOrders = orders ? JSON.parse(orders) : [];
    return allOrders.filter(order => order.userEmail === userEmail);
  } catch (e) {
    console.error('Failed to load user orders:', e);
    return [];
  }
}

function renderUserOrders(orders) {
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
        <span class="text-[10px] font-black uppercase tracking-widest">${new Date(order.timestamp).toLocaleDateString()}</span>
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

// Initialize user dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.protectRoute('user')) return;
  loadDashboard();
});
