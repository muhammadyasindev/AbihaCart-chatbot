/**
 * Abihacart AI Support Cockpit - Enterprise Admin Dashboard Client
 * Vanilla JavaScript (zero external framework dependencies)
 */

const AdminApp = (() => {
  const getBackendOrigin = () => {
    const raw = (window.ABIHACART_CONFIG && window.ABIHACART_CONFIG.backendUrl) ||
      window.ABIHACART_ADMIN_BACKEND_URL ||
      window.ABIHACART_BACKEND_URL ||
      '';
    return String(raw).trim().replace(/\/+$/, '');
  };

  const getApiBase = () => {
    const origin = getBackendOrigin();
    return origin ? `${origin}/api/admin` : '/api/admin';
  };

  let state = {
    token: sessionStorage.getItem('abh_admin_token') || null,
    user: JSON.parse(sessionStorage.getItem('abh_admin_user') || 'null'),
    currentView: 'overview',
  };

  // ---------------------------------------------------------------------------
  // 1. API Client Wrapper
  // ---------------------------------------------------------------------------
  const getOfflineData = (endpoint) => {
    const cleanEndpoint = endpoint.split('?')[0];

    if (cleanEndpoint === '/auth/me') {
      return { user: state.user || { id: 'usr_admin_root_001', username: 'admin', name: 'System Administrator', email: 'admin@abihacart.com', role: 'admin', storeDomain: 'abihacart.myshopify.com' } };
    }
    if (cleanEndpoint === '/sms-orders') {
      return {
        orders: [
          {
            orderReference: 'ABH-ORD-88219401',
            shop: 'abihacart.myshopify.com',
            conversationId: 'abh_conv_demo_01',
            customerName: 'Fatima Al Mansoori',
            customerPhone: '+971 50*** **67',
            deliveryAddress: { street: 'Villa 14, Al Safa 2', city: 'Dubai', emirate: 'Dubai' },
            lineItems: [{ productTitle: 'Abihacart Premium Coffee Maker', quantity: 1, price: 249.00 }],
            subtotal: 249.00,
            deliveryFee: 0.00,
            totalAmount: 249.00,
            currency: 'AED',
            paymentMethod: 'Cash on Delivery (COD)',
            status: 'confirmed',
            shopifyOrderId: 'gid://shopify/Order/1001004',
            shopifyOrderName: '#ABH-1004',
            initialSms: { status: 'delivered', sentAt: new Date(Date.now() - 7200000).toISOString() },
            finalSms: { status: 'delivered', sentAt: new Date(Date.now() - 7100000).toISOString() },
            confirmedAt: new Date(Date.now() - 7100000).toISOString(),
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            orderReference: 'ABH-ORD-88219402',
            shop: 'abihacart.myshopify.com',
            conversationId: 'abh_conv_demo_02',
            customerName: 'Tariq Mansoor',
            customerPhone: '+971 55*** **89',
            deliveryAddress: { street: 'Apartment 402, Marina Promenade', city: 'Dubai', emirate: 'Dubai' },
            lineItems: [{ productTitle: 'Abihacart Barista Grind & Brew Compact', quantity: 1, price: 179.00 }],
            subtotal: 179.00,
            deliveryFee: 0.00,
            totalAmount: 179.00,
            currency: 'AED',
            paymentMethod: 'Cash on Delivery (COD)',
            status: 'pending_confirmation',
            shopifyDraftOrderId: 'gid://shopify/DraftOrder/8888002',
            initialSms: { status: 'sent', sentAt: new Date().toISOString() },
            finalSms: null,
            confirmedAt: null,
            createdAt: new Date().toISOString(),
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
      };
    }
    if (cleanEndpoint === '/overview') {
      return {
        stats: {
          totalConversations: 142,
          activeConversations: 12,
          totalTickets: 38,
          openTickets: 5,
          resolvedTickets: 33,
          aiResolutionRate: 87.5,
          avgResponseTimeMinutes: 3.2,
        },
        recentConversations: [
          { conversationId: 'abh_conv_demo_01', messageCount: 4, status: 'active', updatedAt: new Date().toISOString(), messages: [{ text: 'Do you deliver to Dubai Marina?' }, { text: 'Yes, standard delivery 2-3 business days across UAE.' }] },
          { conversationId: 'abh_conv_demo_02', messageCount: 6, status: 'resolved', updatedAt: new Date(Date.now() - 3600000).toISOString(), messages: [{ text: 'Where is order #1001?' }, { text: 'Order #1001 is Paid and Fulfilled.' }] },
          { conversationId: 'abh_conv_demo_03', messageCount: 2, status: 'active', updatedAt: new Date(Date.now() - 7200000).toISOString(), messages: [{ text: 'Can I return an opened item?' }, { text: 'Items must be unopened in original packaging within 14 days.' }] }
        ],
        recentTickets: [
          { ticketId: 'tkt_demo_001', customerPhone: '+971501234567', customerName: 'Fatima Al Mansoori', status: 'agent_replied', assignedTo: 'agent_tariq', channel: 'whatsapp', serviceWindow: { isOpen: true, remainingHours: 22.4, expiresAt: new Date(Date.now() + 22.4 * 3600000).toISOString() }, messages: [{ sender: 'agent', message: 'Filters are included in the box.' }] },
          { ticketId: 'tkt_demo_002', customerPhone: '+971529876543', customerName: 'Ahmed Al Qasimi', status: 'open', assignedTo: null, channel: 'whatsapp', serviceWindow: { isOpen: true, remainingHours: 18.1, expiresAt: new Date(Date.now() + 18.1 * 3600000).toISOString() }, messages: [{ sender: 'customer', message: 'Need urgent change to delivery address.' }] }
        ]
      };
    }
    if (cleanEndpoint === '/conversations') {
      return {
        conversations: [
          { conversationId: 'abh_conv_demo_01', messageCount: 4, status: 'active', updatedAt: new Date().toISOString(), lastMessage: 'Yes, standard delivery 2-3 business days across UAE.', shop: 'abihacart.myshopify.com' },
          { conversationId: 'abh_conv_demo_02', messageCount: 6, status: 'resolved', updatedAt: new Date(Date.now() - 3600000).toISOString(), lastMessage: 'Order #1001 is Paid and Fulfilled.', shop: 'abihacart.myshopify.com' },
          { conversationId: 'abh_conv_demo_03', messageCount: 2, status: 'active', updatedAt: new Date(Date.now() - 7200000).toISOString(), lastMessage: 'Items must be unopened in original packaging within 14 days.', shop: 'abihacart.myshopify.com' },
          { conversationId: 'abh_conv_demo_04', messageCount: 3, status: 'archived', updatedAt: new Date(Date.now() - 86400000).toISOString(), lastMessage: 'AED 249 includes VAT for the Espresso Maker.', shop: 'abihacart.myshopify.com' }
        ],
        total: 4,
        page: 1,
        pages: 1
      };
    }
    if (cleanEndpoint.startsWith('/conversations/')) {
      return {
        conversation: {
          conversationId: 'abh_conv_demo_01',
          shop: 'abihacart.myshopify.com',
          status: 'active',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            { sender: 'user', text: 'Hello, do you deliver to Dubai Marina?', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { sender: 'assistant', text: 'Yes! We deliver across all UAE emirates, including Dubai Marina, with standard delivery in 2-3 business days (AED 20) or free on orders over AED 200.', timestamp: new Date(Date.now() - 3500000).toISOString() },
            { sender: 'user', text: 'Is Cash on Delivery available?', timestamp: new Date(Date.now() - 1800000).toISOString() },
            { sender: 'assistant', text: 'Yes, Cash on Delivery is available across all UAE emirates with a standard AED 10 handling fee.', timestamp: new Date(Date.now() - 1700000).toISOString() }
          ]
        }
      };
    }
    if (cleanEndpoint === '/tickets') {
      return {
        tickets: [
          {
            ticketId: 'tkt_demo_001',
            customerPhone: '+971501234567',
            customerName: 'Fatima Al Mansoori',
            status: 'agent_replied',
            assignedTo: 'agent_tariq',
            channel: 'whatsapp',
            lastCustomerMessageAt: new Date(Date.now() - 3600000).toISOString(),
            serviceWindow: { isOpen: true, remainingHours: 23.0, expiresAt: new Date(Date.now() + 23 * 3600000).toISOString() },
            messages: [
              { sender: 'customer', message: 'Hello, I received the coffee maker but wanted to know if filters are included?', timestamp: new Date(Date.now() - 7200000).toISOString() },
              { sender: 'agent', senderName: 'Tariq Support', message: 'Hello Fatima! Yes, the Abihacart Espresso Master comes with 5 reusable stainless steel mesh filters in the box.', timestamp: new Date(Date.now() - 3600000).toISOString() }
            ]
          },
          {
            ticketId: 'tkt_demo_002',
            customerPhone: '+971529876543',
            customerName: 'Ahmed Al Qasimi',
            status: 'open',
            assignedTo: null,
            channel: 'whatsapp',
            lastCustomerMessageAt: new Date(Date.now() - 14400000).toISOString(),
            serviceWindow: { isOpen: true, remainingHours: 20.0, expiresAt: new Date(Date.now() + 20 * 3600000).toISOString() },
            messages: [
              { sender: 'customer', message: 'Need urgent change to delivery address for order #1002 before dispatch.', timestamp: new Date(Date.now() - 14400000).toISOString() }
            ]
          },
          {
            ticketId: 'tkt_demo_003',
            customerPhone: '+971558765432',
            customerName: 'Sarah Jenkins',
            status: 'resolved',
            assignedTo: 'agent_salma',
            channel: 'whatsapp',
            lastCustomerMessageAt: new Date(Date.now() - 90000000).toISOString(),
            serviceWindow: { isOpen: false, remainingHours: 0, expiresAt: new Date(Date.now() - 3600000).toISOString() },
            messages: [
              { sender: 'customer', message: 'My tracking link shows delivered, thank you!', timestamp: new Date(Date.now() - 90000000).toISOString() },
              { sender: 'agent', senderName: 'Salma Support', message: 'Glad to hear that, Sarah! Enjoy your purchase.', timestamp: new Date(Date.now() - 89000000).toISOString() }
            ]
          }
        ]
      };
    }
    if (cleanEndpoint.startsWith('/tickets/')) {
      return {
        ticket: {
          ticketId: 'tkt_demo_001',
          customerPhone: '+971501234567',
          customerName: 'Fatima Al Mansoori',
          status: 'agent_replied',
          assignedTo: 'agent_tariq',
          channel: 'whatsapp',
          serviceWindow: { isOpen: true, remainingHours: 23.0, expiresAt: new Date(Date.now() + 23 * 3600000).toISOString() },
          messages: [
            { sender: 'customer', message: 'Hello, I received the coffee maker but wanted to know if filters are included?', timestamp: new Date(Date.now() - 7200000).toISOString() },
            { sender: 'agent', senderName: 'Tariq Support', message: 'Hello Fatima! Yes, the Abihacart Espresso Master comes with 5 reusable stainless steel mesh filters in the box.', timestamp: new Date(Date.now() - 3600000).toISOString() }
          ]
        }
      };
    }
    if (cleanEndpoint === '/ai-monitoring') {
      return {
        telemetry: {
          preferredModel: 'gpt-6-luna',
          activeModel: 'gpt-6-luna',
          totalRequests: 842,
          successfulRequests: 835,
          failedRequests: 7,
          successRatePercent: 99.17,
          averageLatencyMs: 412,
          toolExecutionCounts: {
            search_products: 312,
            get_product_details: 245,
            get_order_status: 128,
            search_knowledge_base: 89,
            get_store_policy: 68
          },
          totalToolInvocations: 842,
          escalationsToHuman: 14,
          mode: 'gpt-6-luna-responses-api'
        }
      };
    }
    if (cleanEndpoint === '/knowledge-base') {
      return {
        entries: [
          { key: 'coffee_maker_troubleshooting', title: 'Espresso Master Troubleshooting', category: 'product_support', content: 'If the machine fails to brew, ensure the water reservoir is seated firmly and descaling cycle has been run.', isApproved: true, approvalStatus: 'approved', approvedBy: 'admin', updatedAt: new Date().toISOString() },
          { key: 'uae_remote_delivery_areas', title: 'UAE Remote Area Shipping Schedule', category: 'shipping', content: 'Deliveries to Western Region (Al Dhafra) take 3-5 business days via courier partners.', isApproved: true, approvalStatus: 'approved', approvedBy: 'admin', updatedAt: new Date().toISOString() },
          { key: 'ramadan_delivery_hours', title: 'Ramadan Support & Delivery Schedule', category: 'store_policy', content: 'Customer support operates 10 AM to 4 PM and 8 PM to 12 AM during holy month of Ramadan.', isApproved: false, approvalStatus: 'pending_approval', createdBy: 'agent_tariq', updatedAt: new Date().toISOString() }
        ]
      };
    }
    if (cleanEndpoint === '/policies') {
      return {
        policies: [
          { key: 'shipping_policy', title: 'UAE Shipping & Delivery Policy', content: 'Standard UAE delivery takes 2-3 business days at AED 20 flat rate. Free delivery applies on orders exceeding AED 200 across UAE.', isApproved: true, isOfficial: true, approvedBy: 'admin', updatedAt: new Date().toISOString() },
          { key: 'return_policy', title: '14-Day Return & Exchange Policy', content: 'Customers may initiate returns within 14 days of delivery. Items must be unopened, unused, and in original packaging.', isApproved: true, isOfficial: true, approvedBy: 'admin', updatedAt: new Date().toISOString() },
          { key: 'payment_policy', title: 'Payment Methods & Currency', content: 'All transactions are processed in UAE Dirhams (AED). We accept Visa, Mastercard, and Cash on Delivery (AED 10 COD fee).', isApproved: true, isOfficial: true, approvedBy: 'admin', updatedAt: new Date().toISOString() },
          { key: 'contact_policy', title: 'Human Support Escalation', content: 'Customer support is available Sunday through Thursday, 9 AM to 6 PM UAE time via WhatsApp Cloud API.', isApproved: true, isOfficial: true, approvedBy: 'admin', updatedAt: new Date().toISOString() }
        ]
      };
    }
    if (cleanEndpoint === '/analytics') {
      return {
        period: '7 days',
        dailyConversations: [
          { date: 'Nov 15', count: 18 },
          { date: 'Nov 16', count: 24 },
          { date: 'Nov 17', count: 31 },
          { date: 'Nov 18', count: 22 },
          { date: 'Nov 19', count: 29 },
          { date: 'Nov 20', count: 35 },
          { date: 'Nov 21', count: 42 }
        ],
        conversationStatusRatio: { active: 12, resolved: 118, archived: 12 },
        ticketStatusRatio: { open: 5, assigned: 8, agent_replied: 12, resolved: 13 },
        channelVolume: { websiteChatbot: 142, whatsapp: 38 },
        averageResponseTimeMinutes: 3.2,
        aiResolutionRatePercent: 87.5
      };
    }
    if (cleanEndpoint === '/agents') {
      return {
        agents: [
          { id: 'usr_admin_root_001', username: 'admin', name: 'System Administrator', email: 'admin@abihacart.com', role: 'admin', isActive: true, lastLoginAt: new Date().toISOString() },
          { id: 'usr_agent_002', username: 'agent_tariq', name: 'Tariq Mansour', email: 'tariq@abihacart.com', role: 'agent', isActive: true, lastLoginAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 'usr_agent_003', username: 'agent_salma', name: 'Salma Al Zaabi', email: 'salma@abihacart.com', role: 'agent', isActive: true, lastLoginAt: new Date(Date.now() - 7200000).toISOString() },
          { id: 'usr_agent_004', username: 'agent_khalid', name: 'Khalid Rashid', email: 'khalid@abihacart.com', role: 'agent', isActive: false, lastLoginAt: null }
        ]
      };
    }
    if (cleanEndpoint === '/settings') {
      return {
        platform: {
          environment: 'development',
          runtime: 'Node.js v24.19.0',
          framework: 'Express v4.21.2',
          database: 'MongoDB / Mongoose v8.9.5',
          storeDomain: 'abihacart.myshopify.com'
        },
        integrations: {
          shopify: { configured: true, scope: 'read_products,read_inventory,read_orders', mode: 'GraphQL Admin API (read-only)' },
          openai: { configured: true, preferredModel: 'gpt-6-luna', endpoint: '/v1/responses' },
          whatsapp: { configured: true, graphApiVersion: 'v26.0', serviceWindowHours: 24 }
        },
        security: {
          adminTokenExpiry: '24 hours',
          passwordHashing: 'PBKDF2 SHA-512 (100,000 rounds)',
          corsWhitelisted: true,
          secretsMasked: true
        }
      };
    }
    return { ok: true };
  };

  const api = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }

    try {
      const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        // Session expired or invalid credentials
        logout();
        throw new Error(data.message || 'Session expired. Please sign in again.');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${endpoint}]:`, err);
      throw err;
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Authentication & Session Handling
  // ---------------------------------------------------------------------------
  const initAuth = async () => {
    const authView = document.getElementById('auth-view');
    const dashboardShell = document.getElementById('dashboard-shell');

    if (!state.token || !state.user) {
      authView.style.display = 'flex';
      dashboardShell.style.display = 'none';
      return;
    }

    try {
      const res = await api('/auth/me');
      state.user = res.user;
      sessionStorage.setItem('abh_admin_user', JSON.stringify(res.user));

      renderUserProfile();
      authView.style.display = 'none';
      dashboardShell.style.display = 'flex';
      switchView(state.currentView);
    } catch (err) {
      logout();
    }
  };

  const login = async (username, password) => {
    const alertBox = document.getElementById('auth-alert');
    const loginBtn = document.getElementById('login-btn');
    const loginBtnText = document.getElementById('login-btn-text');

    alertBox.style.display = 'none';
    loginBtn.disabled = true;
    loginBtnText.textContent = 'Verifying credentials...';

    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      state.token = res.token;
      state.user = res.user;
      sessionStorage.setItem('abh_admin_token', res.token);
      sessionStorage.setItem('abh_admin_user', JSON.stringify(res.user));

      showToast(`Welcome back, ${res.user.name}!`, 'success');
      initAuth();
    } catch (err) {
      alertBox.textContent = err.message || 'Authentication failed. Please check your credentials.';
      alertBox.style.display = 'flex';
    } finally {
      loginBtn.disabled = false;
      loginBtnText.textContent = 'Sign In to Cockpit';
    }
  };

  const logout = () => {
    if (state.token) {
      api('/auth/logout', { method: 'POST' }).catch(() => { });
    }
    state.token = null;
    state.user = null;
    sessionStorage.removeItem('abh_admin_token');
    sessionStorage.removeItem('abh_admin_user');

    document.getElementById('auth-view').style.display = 'flex';
    document.getElementById('dashboard-shell').style.display = 'none';
    showToast('Signed out successfully.', 'info');
  };

  const renderUserProfile = () => {
    if (!state.user) return;
    document.getElementById('user-display-name').textContent = state.user.name || state.user.username;
    document.getElementById('user-display-role').textContent = state.user.role === 'admin' ? 'Administrator' : 'Support Specialist';
    document.getElementById('user-avatar').textContent = (state.user.name || state.user.username).charAt(0).toUpperCase();

    // Toggle admin-only sidebar links
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach((el) => {
      el.style.display = state.user.role === 'admin' ? 'flex' : 'none';
    });
  };

  // ---------------------------------------------------------------------------
  // 3. Navigation & Router
  // ---------------------------------------------------------------------------
  const switchView = (viewName) => {
    // Role check: block agents from admin-only views
    if ((viewName === 'agents' || viewName === 'settings') && state.user?.role !== 'admin') {
      showToast('Admin privileges required to access this section.', 'error');
      return;
    }

    state.currentView = viewName;

    // Update active nav link
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Update breadcrumb
    const titles = {
      overview: 'Overview Dashboard',
      conversations: 'Customer Conversations Management',
      tickets: 'WhatsApp Business Support Tickets',
      orders: 'Customer SMS Orders & Confirmations',
      'ai-monitoring': 'AI Telemetry & Tool Monitoring',
      'knowledge-base': 'Store Knowledge Base & FAQ Management',
      'store-policies': 'Official Store Policies Governance',
      analytics: 'Support & Response Analytics',
      agents: 'Team & Support Agent Management',
      settings: 'Infrastructure & System Settings',
    };
    document.getElementById('top-breadcrumb').textContent = titles[viewName] || 'Dashboard';

    // Show selected view panel
    document.querySelectorAll('.content-view').forEach((view) => {
      view.style.display = view.id === `view-${viewName}` ? 'block' : 'none';
    });

    // Load view data
    switch (viewName) {
      case 'overview':
        loadOverview();
        break;
      case 'conversations':
        loadConversations();
        break;
      case 'tickets':
        loadTickets();
        break;
      case 'orders':
        loadOrders();
        break;
      case 'ai-monitoring':
        loadAiMonitoring();
        break;
      case 'knowledge-base':
        loadKnowledgeBase();
        break;
      case 'store-policies':
        loadPolicies();
        break;
      case 'analytics':
        loadAnalytics();
        break;
      case 'agents':
        loadAgents();
        break;
      case 'settings':
        loadSettings();
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // 4. View Data Loaders
  // ---------------------------------------------------------------------------

  // 4.1: Overview
  const loadOverview = async () => {
    try {
      const res = await api('/overview');
      const stats = res.data.stats;

      document.getElementById('stat-total-conversations').textContent = stats.totalConversations;
      document.getElementById('stat-open-tickets').textContent = stats.openTickets;
      document.getElementById('stat-pending-replies').textContent = stats.pendingAgentTickets;
      document.getElementById('stat-resolved-tickets').textContent = stats.resolvedTickets;
      document.getElementById('stat-ai-handled').textContent = stats.aiHandledConversations;
      document.getElementById('stat-avg-response').textContent = `${stats.avgResponseTimeMinutes || 0}m`;

      document.getElementById('badge-conv-count').textContent = stats.totalConversations;
      document.getElementById('badge-ticket-count').textContent = stats.openTickets + stats.pendingAgentTickets;

      // Render recent conversations
      const convTable = document.getElementById('overview-recent-convs');
      if (res.data.recentConversations && res.data.recentConversations.length > 0) {
        convTable.innerHTML = res.data.recentConversations.map((c) => `
          <tr>
            <td><strong>${escapeHtml(c.conversationId)}</strong></td>
            <td><span class="badge ${c.status === 'active' ? 'badge-primary' : (c.status === 'escalated' ? 'badge-danger' : 'badge-gray')}">${c.status}</span></td>
            <td>${c.messages?.length || 0} msgs</td>
            <td>${formatDate(c.lastMessageAt || c.updatedAt)}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="AdminApp.openConversationModal('${escapeHtml(c.conversationId)}')">Inspect</button></td>
          </tr>
        `).join('');
      } else {
        convTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No recent conversations found.</td></tr>`;
      }

      // Render recent tickets
      const ticketTable = document.getElementById('overview-recent-tickets');
      if (res.data.recentTickets && res.data.recentTickets.length > 0) {
        ticketTable.innerHTML = res.data.recentTickets.map((t) => `
          <tr>
            <td><strong>${escapeHtml(t.ticketId)}</strong></td>
            <td>${escapeHtml(t.customer?.name || t.customer?.phone || 'Customer')}</td>
            <td><span class="badge ${t.status === 'pending_agent' ? 'badge-danger' : (t.status === 'open' ? 'badge-warning' : 'badge-success')}">${t.status}</span></td>
            <td><span class="badge badge-primary">WhatsApp</span></td>
            <td><button class="btn btn-secondary btn-sm" onclick="AdminApp.openTicketModal('${escapeHtml(t.ticketId)}')">View</button></td>
          </tr>
        `).join('');
      } else {
        ticketTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No recent tickets found.</td></tr>`;
      }
    } catch (err) {
      showToast('Failed to load overview data.', 'error');
    }
  };

  // 4.2: Conversations
  const loadConversations = async () => {
    const tableBody = document.getElementById('conversations-table-body');
    const search = document.getElementById('conv-search-input').value.trim();
    const status = document.getElementById('conv-status-filter').value;

    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">Loading conversations...</td></tr>`;

    try {
      const res = await api(`/conversations?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);
      const items = res.data?.conversations || [];

      if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">No conversations match your criteria.</td></tr>`;
        return;
      }

      tableBody.innerHTML = items.map((c) => {
        const lastMsg = c.messages?.[c.messages.length - 1];
        return `
          <tr>
            <td><strong>${escapeHtml(c.conversationId)}</strong></td>
            <td>${escapeHtml(c.customer?.name || 'Storefront Visitor')}</td>
            <td><span class="badge ${c.status === 'active' ? 'badge-primary' : (c.status === 'escalated' ? 'badge-danger' : 'badge-gray')}">${c.status}</span></td>
            <td>${c.messages?.length || 0}</td>
            <td>${formatDate(c.createdAt)}</td>
            <td>${formatDate(c.lastMessageAt || c.updatedAt)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.openConversationModal('${escapeHtml(c.conversationId)}')">Inspect & Reply</button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444;">Failed to load conversations: ${err.message}</td></tr>`;
    }
  };

  const openConversationModal = async (conversationId) => {
    try {
      const res = await api(`/conversations/${conversationId}`);
      const conv = res.data;

      const messagesHtml = (conv.messages || []).map((m) => {
        const isUser = m.sender === 'user';
        const isAgent = m.sender === 'agent';
        const senderTag = isUser ? 'Customer' : (isAgent ? 'Support Specialist (Agent)' : 'Abihacart AI (GPT-6 Luna)');
        const bubbleClass = isUser ? 'bubble-user' : (isAgent ? 'bubble-agent' : 'bubble-ai');

        return `
          <div class="chat-bubble ${bubbleClass}">
            <div class="bubble-sender-tag">${escapeHtml(senderTag)}</div>
            <div>${escapeHtml(m.text)}</div>
            <div class="bubble-time">${formatDate(m.timestamp)}</div>
          </div>
        `;
      }).join('');

      const modalHtml = `
        <div class="modal-dialog" style="max-width: 680px;">
          <div class="modal-header">
            <div>
              <h3>Conversation [${escapeHtml(conv.conversationId)}]</h3>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
                Status: <span class="badge ${conv.status === 'active' ? 'badge-primary' : 'badge-danger'}">${conv.status}</span>
                • Store: ${escapeHtml(conv.shop)}
              </div>
            </div>
            <button class="modal-close-btn" onclick="AdminApp.closeModal()">✕</button>
          </div>

          <div class="modal-body" style="padding: 1rem;">
            <div class="chat-inspector-container">
              <div class="chat-messages-scroll" id="modal-chat-scroll">
                ${messagesHtml || '<div style="text-align: center; color: #64748b; margin-top: 2rem;">No messages recorded.</div>'}
              </div>
              <div class="chat-reply-bar">
                <input type="text" id="modal-agent-reply-input" class="form-input" placeholder="Type a response to the customer...">
                <button class="btn btn-primary btn-sm" onclick="AdminApp.sendConversationReply('${escapeHtml(conv.conversationId)}')">Send Reply</button>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="justify-content: space-between;">
            <div>
              <label style="font-size: 0.75rem; font-weight: 600; color: #64748b; margin-right: 0.5rem;">Update Status:</label>
              <select id="modal-conv-status-select" class="form-select" style="width: 120px; display: inline-block;">
                <option value="active" ${conv.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="escalated" ${conv.status === 'escalated' ? 'selected' : ''}>Escalated</option>
                <option value="closed" ${conv.status === 'closed' ? 'selected' : ''}>Closed</option>
              </select>
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.updateConversationStatus('${escapeHtml(conv.conversationId)}')">Save</button>
            </div>
            <button class="btn btn-secondary" onclick="AdminApp.closeModal()">Close</button>
          </div>
        </div>
      `;

      openModal(modalHtml);

      // Auto scroll chat to bottom
      setTimeout(() => {
        const scrollEl = document.getElementById('modal-chat-scroll');
        if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
      }, 50);
    } catch (err) {
      showToast(`Cannot inspect conversation: ${err.message}`, 'error');
    }
  };

  const sendConversationReply = async (conversationId) => {
    const input = document.getElementById('modal-agent-reply-input');
    const message = input.value.trim();
    if (!message) return;

    try {
      await api(`/conversations/${conversationId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      showToast('Agent reply synchronized to storefront conversation.', 'success');
      input.value = '';
      openConversationModal(conversationId);
      loadConversations();
    } catch (err) {
      showToast(`Failed to send reply: ${err.message}`, 'error');
    }
  };

  const updateConversationStatus = async (conversationId) => {
    const status = document.getElementById('modal-conv-status-select').value;
    try {
      await api(`/conversations/${conversationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      showToast(`Conversation status updated to ${status}.`, 'success');
      closeModal();
      loadConversations();
      loadOverview();
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  // 4.3: WhatsApp Tickets
  const loadTickets = async () => {
    const tableBody = document.getElementById('tickets-table-body');
    const status = document.getElementById('ticket-status-filter').value;

    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">Loading tickets...</td></tr>`;

    try {
      const res = await api(`/tickets?status=${encodeURIComponent(status)}`);
      const items = res.data || [];

      if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">No WhatsApp support tickets found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = items.map((t) => {
        const windowBadge = t.isWithin24hWindow
          ? '<span class="badge badge-success">● Active Window</span>'
          : '<span class="badge badge-danger">● Expired (Template Required)</span>';

        return `
          <tr>
            <td><strong>${escapeHtml(t.ticketId)}</strong></td>
            <td>${escapeHtml(t.customer?.maskedPhone || t.customer?.phone || '***')}</td>
            <td>${escapeHtml(t.customer?.name || 'WhatsApp Customer')}</td>
            <td><span class="badge ${t.status === 'pending_agent' ? 'badge-danger' : (t.status === 'open' ? 'badge-warning' : 'badge-success')}">${t.status}</span></td>
            <td>${escapeHtml(t.assignedTo || 'Unassigned')}</td>
            <td>${windowBadge}</td>
            <td>${formatDate(t.lastCustomerMessageAt || t.updatedAt)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.openTicketModal('${escapeHtml(t.ticketId)}')">Inspect & Reply</button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #ef4444;">Failed to load tickets: ${err.message}</td></tr>`;
    }
  };

  const openTicketModal = async (ticketId) => {
    try {
      const res = await api(`/tickets/${ticketId}`);
      const t = res.data;

      const windowBanner = t.isWithin24hWindow
        ? `<div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 0.625rem; font-size: 0.8125rem; color: #065f46; margin-bottom: 0.75rem;">
            🟢 <strong>Active 24-Hour Customer Window:</strong> Free-form text replies can be sent directly to the customer's WhatsApp.
           </div>`
        : `<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.625rem; font-size: 0.8125rem; color: #991b1b; margin-bottom: 0.75rem;">
            🔴 <strong>24-Hour Service Window Expired:</strong> Meta WhatsApp Business Policy requires an approved message template to re-engage this customer. Free-form text will be blocked.
           </div>`;

      const messagesHtml = (t.messages || []).map((m) => {
        const isUser = m.sender === 'user';
        const senderTag = isUser ? `WhatsApp Customer (${escapeHtml(t.customer?.name || 'Customer')})` : `Support Agent (${escapeHtml(m.senderName || 'Specialist')})`;
        const bubbleClass = isUser ? 'bubble-user' : 'bubble-agent';
        const deliveryReceipt = m.status ? `<span style="font-size: 0.625rem; margin-left: 0.5rem; opacity: 0.8;">[Status: ${m.status}]</span>` : '';

        return `
          <div class="chat-bubble ${bubbleClass}">
            <div class="bubble-sender-tag">${escapeHtml(senderTag)} ${deliveryReceipt}</div>
            <div>${escapeHtml(m.text)}</div>
            <div class="bubble-time">${formatDate(m.timestamp)}</div>
          </div>
        `;
      }).join('');

      const modalHtml = `
        <div class="modal-dialog" style="max-width: 720px;">
          <div class="modal-header">
            <div>
              <h3>Support Ticket [${escapeHtml(t.ticketId)}]</h3>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
                Customer: ${escapeHtml(t.customer?.name || 'Customer')} • Phone: ${escapeHtml(t.customer?.maskedPhone || '***')}
                • Status: <span class="badge badge-warning">${t.status}</span>
              </div>
            </div>
            <button class="modal-close-btn" onclick="AdminApp.closeModal()">✕</button>
          </div>

          <div class="modal-body" style="padding: 1rem;">
            ${windowBanner}

            <div class="chat-inspector-container">
              <div class="chat-messages-scroll" id="modal-ticket-chat-scroll">
                ${messagesHtml || '<div style="text-align: center; color: #64748b; margin-top: 2rem;">No messages recorded.</div>'}
              </div>
              <div class="chat-reply-bar" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="modal-ticket-reply-input" class="form-input" placeholder="Type WhatsApp reply message...">
                  <button class="btn btn-primary btn-sm" onclick="AdminApp.sendTicketReply('${escapeHtml(t.ticketId)}', false)">Send Message</button>
                </div>
                ${!t.isWithin24hWindow ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #991b1b; padding-top: 0.25rem;">
                    <span>Window expired. Send approved template instead:</span>
                    <button class="btn btn-secondary btn-sm" onclick="AdminApp.sendTicketReply('${escapeHtml(t.ticketId)}', true)">Send Followup Template</button>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="modal-footer" style="justify-content: space-between;">
            <div>
              <label style="font-size: 0.75rem; font-weight: 600; color: #64748b; margin-right: 0.5rem;">Status:</label>
              <select id="modal-ticket-status-select" class="form-select" style="width: 140px; display: inline-block;">
                <option value="pending_agent" ${t.status === 'pending_agent' ? 'selected' : ''}>Pending Agent</option>
                <option value="open" ${t.status === 'open' ? 'selected' : ''}>Open</option>
                <option value="agent_replied" ${t.status === 'agent_replied' ? 'selected' : ''}>Agent Replied</option>
                <option value="resolved" ${t.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                <option value="closed" ${t.status === 'closed' ? 'selected' : ''}>Closed</option>
              </select>
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.updateTicketStatus('${escapeHtml(t.ticketId)}')">Update</button>
            </div>
            <button class="btn btn-secondary" onclick="AdminApp.closeModal()">Close</button>
          </div>
        </div>
      `;

      openModal(modalHtml);

      setTimeout(() => {
        const scrollEl = document.getElementById('modal-ticket-chat-scroll');
        if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
      }, 50);
    } catch (err) {
      showToast(`Cannot inspect ticket: ${err.message}`, 'error');
    }
  };

  const sendTicketReply = async (ticketId, isTemplate = false) => {
    const input = document.getElementById('modal-ticket-reply-input');
    const message = input.value.trim() || 'Customer support follow-up message from Abihacart.';

    const payload = {
      message,
    };

    if (isTemplate) {
      payload.template = {
        name: 'customer_support_followup',
        languageCode: 'en_US',
        components: [],
      };
    }

    try {
      await api(`/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast(isTemplate ? 'Approved WhatsApp template dispatched!' : 'WhatsApp reply sent successfully!', 'success');
      input.value = '';
      openTicketModal(ticketId);
      loadTickets();
      loadOverview();
    } catch (err) {
      showToast(`Delivery rejected: ${err.message}`, 'error');
    }
  };

  const updateTicketStatus = async (ticketId) => {
    const status = document.getElementById('modal-ticket-status-select').value;
    try {
      await api(`/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      showToast(`Ticket status updated to ${status}.`, 'success');
      closeModal();
      loadTickets();
      loadOverview();
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  // 4.3.5: Customer SMS Orders Management
  const loadOrders = async () => {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;
    const status = document.getElementById('order-status-filter')?.value || '';
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b;">Loading SMS orders...</td></tr>`;

    try {
      const endpoint = status ? `/sms-orders?status=${encodeURIComponent(status)}` : '/sms-orders';
      const res = await api(endpoint);
      const orders = res.orders || [];

      const badge = document.getElementById('badge-order-count');
      if (badge) badge.textContent = res.total || orders.length;

      if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b;">No customer SMS orders found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = orders.map((o) => {
        const primaryItem = o.lineItems?.[0] ? `${o.lineItems[0].productTitle} (x${o.lineItems[0].quantity})` : 'Product';
        const statusBadgeClass = o.status === 'confirmed' ? 'badge-success' : (o.status === 'expired' ? 'badge-danger' : (o.status === 'failed' ? 'badge-danger' : 'badge-warning'));
        const statusText = o.status === 'confirmed' ? 'Confirmed' : (o.status === 'expired' ? 'Expired' : (o.status === 'failed' ? 'Failed Delivery' : 'Pending SMS Confirmation'));
        const smsStatusText = o.initialSms?.status === 'delivered' ? '✓ Delivered' : (o.initialSms?.status === 'sent' ? '⏳ Sent' : (o.initialSms?.status === 'failed' ? '✕ Failed' : (o.initialSms?.status || 'Pending')));

        return `
          <tr>
            <td><strong style="color: #b89a63;">${escapeHtml(o.orderReference)}</strong></td>
            <td>${escapeHtml(o.customerName || 'Customer')}</td>
            <td><code>${escapeHtml(o.customerPhone || '')}</code></td>
            <td>${escapeHtml(primaryItem)}</td>
            <td><strong>AED ${Number(o.totalAmount || 0).toFixed(2)}</strong></td>
            <td><span style="font-size: 11.5px; color: #64748b;">${smsStatusText}</span></td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>${o.shopifyOrderName ? `<span style="font-weight: 700; color: #16a34a;">${escapeHtml(o.shopifyOrderName)}</span>` : '<span style="color: #94a3b8;">Draft</span>'}</td>
            <td>
              ${o.conversationId ? `<button class="btn btn-secondary btn-sm" onclick="AdminApp.viewOrderConversation('${escapeHtml(o.conversationId)}')">View Chat</button>` : '—'}
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #ef4444;">Failed to load orders: ${escapeHtml(err.message)}</td></tr>`;
    }
  };

  const viewOrderConversation = (conversationId) => {
    switchView('conversations');
    openConversationModal(conversationId);
  };

  // 4.4: AI Conversation Monitoring
  const loadAiMonitoring = async () => {
    try {
      const res = await api('/ai-monitoring');
      const data = res.data;

      document.getElementById('ai-model-tag').textContent = data.model || 'gpt-6-luna';
      document.getElementById('ai-total-requests').textContent = data.metrics?.totalRequests || 0;
      document.getElementById('ai-success-rate').textContent = `${data.metrics?.successRate || 100}%`;
      document.getElementById('ai-escalation-count').textContent = data.metrics?.escalations || 0;

      // Render tool calling executions
      const toolsGrid = document.getElementById('ai-tool-executions-grid');
      const executions = data.toolExecutions || {};
      toolsGrid.innerHTML = Object.entries(executions).map(([name, count]) => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.875rem;">
          <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">${escapeHtml(name)}</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-top: 0.25rem;">${count} calls</div>
        </div>
      `).join('');

      // Render recent activity
      const activityBody = document.getElementById('ai-activity-table-body');
      const activities = data.recentActivity || [];

      if (activities.length === 0) {
        activityBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">No recent AI execution records.</td></tr>`;
        return;
      }

      activityBody.innerHTML = activities.map((a) => `
        <tr>
          <td>${formatDate(a.timestamp)}</td>
          <td>${escapeHtml(a.userMessage)}</td>
          <td><span class="badge badge-purple">${escapeHtml(a.model)}</span></td>
          <td>${a.toolCallsCount}</td>
          <td>${a.latencyMs}ms</td>
          <td>${a.escalated ? '<span class="badge badge-danger">Escalated</span>' : '<span class="badge badge-success">Resolved</span>'}</td>
        </tr>
      `).join('');
    } catch (err) {
      showToast('Failed to load AI monitoring data.', 'error');
    }
  };

  // 4.5: Knowledge Base
  const loadKnowledgeBase = async () => {
    const tableBody = document.getElementById('kb-table-body');
    const search = document.getElementById('kb-search-input').value.trim();
    const category = document.getElementById('kb-category-filter').value;

    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">Loading entries...</td></tr>`;

    try {
      const res = await api(`/knowledge-base?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      const items = res.data || [];

      if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">No knowledge base records found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = items.map((kb) => `
        <tr>
          <td><code style="font-size: 0.75rem;">${escapeHtml(kb.key)}</code></td>
          <td><strong>${escapeHtml(kb.title)}</strong></td>
          <td><span class="badge badge-primary">${escapeHtml(kb.category)}</span></td>
          <td>${kb.isApproved ? '<span class="badge badge-success">Approved</span>' : '<span class="badge badge-warning">Pending Approval</span>'}</td>
          <td style="max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(kb.content)}</td>
          <td>${formatDate(kb.updatedAt)}</td>
          <td>
            <div style="display: flex; gap: 0.375rem;">
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.openKbModal('${escapeHtml(kb.key)}')">Edit</button>
              ${!kb.isApproved && state.user?.role === 'admin' ? `
                <button class="btn btn-success btn-sm" onclick="AdminApp.approveKnowledgeEntry('${escapeHtml(kb.key)}')">Approve</button>
              ` : ''}
              <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteKbEntry('${escapeHtml(kb.key)}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444;">Failed to load knowledge base: ${err.message}</td></tr>`;
    }
  };

  const openKbModal = async (key = null) => {
    let entry = { key: '', title: '', category: 'faq', content: '' };
    const isEdit = Boolean(key);

    if (isEdit) {
      try {
        const res = await api('/knowledge-base');
        const found = (res.data || []).find((k) => k.key === key);
        if (found) entry = found;
      } catch (err) {
        showToast('Could not fetch entry details.', 'error');
        return;
      }
    }

    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Knowledge Entry' : 'Create Knowledge Entry'}</h3>
          <button class="modal-close-btn" onclick="AdminApp.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <form id="kb-form">
            <div class="form-group">
              <label class="form-label">Key Identifier</label>
              <input type="text" id="kb-form-key" class="form-input" value="${escapeHtml(entry.key)}" placeholder="e.g. coffee_maker_warranty" ${isEdit ? 'disabled' : 'required'}>
            </div>
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" id="kb-form-title" class="form-input" value="${escapeHtml(entry.title)}" placeholder="Clear topic title" required>
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="kb-form-category" class="form-select">
                <option value="shipping" ${entry.category === 'shipping' ? 'selected' : ''}>Shipping</option>
                <option value="returns" ${entry.category === 'returns' ? 'selected' : ''}>Returns</option>
                <option value="payments" ${entry.category === 'payments' ? 'selected' : ''}>Payments</option>
                <option value="faq" ${entry.category === 'faq' ? 'selected' : ''}>FAQ</option>
                <option value="store_info" ${entry.category === 'store_info' ? 'selected' : ''}>Store Info</option>
                <option value="support" ${entry.category === 'support' ? 'selected' : ''}>Support</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Content (Facts used by AI Engine)</label>
              <textarea id="kb-form-content" class="form-textarea" placeholder="Provide accurate, verified store information..." required>${escapeHtml(entry.content)}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="AdminApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminApp.saveKbEntry(${isEdit})">${isEdit ? 'Save Changes' : 'Create Entry'}</button>
        </div>
      </div>
    `;

    openModal(modalHtml);
  };

  const saveKbEntry = async (isEdit) => {
    const key = document.getElementById('kb-form-key').value.trim();
    const title = document.getElementById('kb-form-title').value.trim();
    const category = document.getElementById('kb-form-category').value;
    const content = document.getElementById('kb-form-content').value.trim();

    if (!key || !title || !content) {
      showToast('All fields are required.', 'error');
      return;
    }

    try {
      if (isEdit) {
        await api(`/knowledge-base/${key}`, {
          method: 'PUT',
          body: JSON.stringify({ title, category, content }),
        });
        showToast(`Knowledge entry [${key}] updated.`, 'success');
      } else {
        await api('/knowledge-base', {
          method: 'POST',
          body: JSON.stringify({ key, title, category, content }),
        });
        showToast(`Knowledge entry [${key}] created (Pending Admin Review).`, 'success');
      }
      closeModal();
      loadKnowledgeBase();
    } catch (err) {
      showToast(`Error saving entry: ${err.message}`, 'error');
    }
  };

  const approveKnowledgeEntry = async (key) => {
    if (!confirm(`Are you sure you want to approve [${key}] as official store knowledge?`)) return;

    try {
      await api(`/knowledge-base/${key}/approve`, { method: 'PATCH' });
      showToast(`Knowledge entry [${key}] approved.`, 'success');
      loadKnowledgeBase();
    } catch (err) {
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const deleteKbEntry = async (key) => {
    if (!confirm(`Are you sure you want to delete knowledge base entry [${key}]?`)) return;

    try {
      await api(`/knowledge-base/${key}`, { method: 'DELETE' });
      showToast(`Knowledge entry [${key}] deleted.`, 'success');
      loadKnowledgeBase();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // 4.6: Store Policies
  const loadPolicies = async () => {
    const container = document.getElementById('policies-list-container');
    container.innerHTML = '<div style="text-align: center; color: #64748b;">Loading policies...</div>';

    try {
      const res = await api('/policies');
      const policies = res.data || [];

      if (policies.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #64748b;">No policies defined.</div>';
        return;
      }

      container.innerHTML = policies.map((p) => `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${escapeHtml(p.title)}</h3>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
                Policy Key: <code>${escapeHtml(p.key)}</code>
                • Category: <span class="badge badge-primary">${escapeHtml(p.category)}</span>
                • Status: ${p.isApproved ? '<span class="badge badge-success">● Published</span>' : '<span class="badge badge-warning">● Pending Approval</span>'}
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              ${!p.isApproved && state.user?.role === 'admin' ? `
                <button class="btn btn-success btn-sm" onclick="AdminApp.publishPolicy('${escapeHtml(p.key)}')">Publish to AI</button>
              ` : ''}
              ${p.isApproved && state.user?.role === 'admin' ? `
                <button class="btn btn-secondary btn-sm" onclick="AdminApp.deactivatePolicy('${escapeHtml(p.key)}')">Deactivate</button>
              ` : ''}
              <button class="btn btn-primary btn-sm" onclick="AdminApp.savePolicyDraft('${escapeHtml(p.key)}')">Save Policy</button>
            </div>
          </div>
          <div class="card-body">
            <textarea id="policy-content-${escapeHtml(p.key)}" class="form-textarea" style="min-height: 90px; font-size: 0.875rem;">${escapeHtml(p.content)}</textarea>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; text-align: right;">
              Last Updated: ${formatDate(p.updatedAt)} by ${escapeHtml(p.lastUpdatedBy || 'system')}
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `<div style="color: #ef4444;">Failed to load policies: ${err.message}</div>`;
    }
  };

  const savePolicyDraft = async (key) => {
    const textarea = document.getElementById(`policy-content-${key}`);
    const content = textarea.value.trim();

    try {
      await api(`/policies/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
      showToast(`Policy [${key}] saved successfully.`, 'success');
      loadPolicies();
    } catch (err) {
      showToast(`Failed to update policy: ${err.message}`, 'error');
    }
  };

  const publishPolicy = async (key) => {
    if (!confirm(`Are you sure you want to approve and publish [${key}] as verified store policy?`)) return;

    try {
      await api(`/policies/${key}/publish`, { method: 'PATCH' });
      showToast(`Policy [${key}] published to AI Knowledge Base!`, 'success');
      loadPolicies();
    } catch (err) {
      showToast(`Publication failed: ${err.message}`, 'error');
    }
  };

  const deactivatePolicy = async (key) => {
    if (!confirm(`Are you sure you want to deactivate policy [${key}]? The AI will revert to pending status.`)) return;

    try {
      await api(`/policies/${key}/deactivate`, { method: 'PATCH' });
      showToast(`Policy [${key}] deactivated.`, 'info');
      loadPolicies();
    } catch (err) {
      showToast(`Deactivation failed: ${err.message}`, 'error');
    }
  };

  // 4.7: Analytics
  const loadAnalytics = async () => {
    try {
      const res = await api('/analytics?days=7');
      const data = res.data;

      document.getElementById('analytics-escalation-rate').textContent = `${data.escalationRate || 0}%`;
      document.getElementById('analytics-open-resolved-ratio').textContent = `${data.openVsResolved?.open || 0} : ${data.openVsResolved?.resolved || 0}`;
      document.getElementById('analytics-ai-human-volume').textContent = `${data.aiVsHumanSupport?.aiHandled || 0} AI / ${data.aiVsHumanSupport?.humanHandled || 0} Human`;

      // Render daily volume SVG bar chart
      renderDailyVolumeChart(data.conversationsPerDay || []);
    } catch (err) {
      showToast('Failed to load analytics.', 'error');
    }
  };

  const renderDailyVolumeChart = (dailyData) => {
    const container = document.getElementById('daily-volume-chart-container');
    if (!dailyData || dailyData.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #64748b; line-height: 200px;">No conversation data available yet.</div>';
      return;
    }

    const maxCount = Math.max(...dailyData.map((d) => d.count), 5);
    const height = 180;
    const width = 600;
    const barWidth = 40;
    const spacing = (width - dailyData.length * barWidth) / (dailyData.length + 1);

    const barsSvg = dailyData.map((d, index) => {
      const barHeight = Math.max(8, (d.count / maxCount) * (height - 40));
      const x = spacing + index * (barWidth + spacing);
      const y = height - barHeight - 24;

      return `
        <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" />
        <text class="chart-label" x="${x + barWidth / 2}" y="${y - 6}">${d.count}</text>
        <text class="chart-label" x="${x + barWidth / 2}" y="${height - 6}">${d.date.substring(5)}</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
        ${barsSvg}
      </svg>
    `;
  };

  // 4.8: Team & Agent Management (Admin Only)
  const loadAgents = async () => {
    const tableBody = document.getElementById('agents-table-body');
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">Loading agents...</td></tr>`;

    try {
      const res = await api('/agents');
      const agents = res.data || [];

      if (agents.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">No agents registered.</td></tr>`;
        return;
      }

      tableBody.innerHTML = agents.map((a) => `
        <tr>
          <td><code style="font-size: 0.75rem;">${escapeHtml(a.id)}</code></td>
          <td><strong>${escapeHtml(a.username)}</strong></td>
          <td>${escapeHtml(a.name)}</td>
          <td>${escapeHtml(a.email)}</td>
          <td><span class="badge ${a.role === 'admin' ? 'badge-purple' : 'badge-primary'}">${a.role}</span></td>
          <td>${a.isActive ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Deactivated</span>'}</td>
          <td>${formatDate(a.createdAt)}</td>
          <td>
            ${a.id !== state.user?.id ? `
              <button class="btn btn-secondary btn-sm" onclick="AdminApp.toggleAgentStatus('${escapeHtml(a.id)}', ${!a.isActive})">
                ${a.isActive ? 'Deactivate' : 'Activate'}
              </button>
            ` : '<span style="font-size: 0.75rem; color: #64748b;">(Current User)</span>'}
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #ef4444;">Failed to load agents: ${err.message}</td></tr>`;
    }
  };

  const openAddAgentModal = () => {
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>Add Support Agent Account</h3>
          <button class="modal-close-btn" onclick="AdminApp.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <form id="add-agent-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="new-agent-name" class="form-input" placeholder="e.g. Tariq Mansoor" required>
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" id="new-agent-username" class="form-input" placeholder="e.g. tariq" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="new-agent-email" class="form-input" placeholder="tariq@abihacart.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Password</label>
              <input type="password" id="new-agent-password" class="form-input" placeholder="Minimum 8 characters" required>
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <select id="new-agent-role" class="form-select">
                <option value="agent">Support Specialist (Agent)</option>
                <option value="admin">Administrator (Admin)</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="AdminApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminApp.saveNewAgent()">Create Account</button>
        </div>
      </div>
    `;
    openModal(modalHtml);
  };

  const saveNewAgent = async () => {
    const name = document.getElementById('new-agent-name').value.trim();
    const username = document.getElementById('new-agent-username').value.trim();
    const email = document.getElementById('new-agent-email').value.trim();
    const password = document.getElementById('new-agent-password').value;
    const role = document.getElementById('new-agent-role').value;

    if (!name || !username || !email || !password) {
      showToast('All fields are required.', 'error');
      return;
    }

    try {
      await api('/agents', {
        method: 'POST',
        body: JSON.stringify({ name, username, email, password, role }),
      });
      showToast(`Agent account [${username}] created successfully!`, 'success');
      closeModal();
      loadAgents();
    } catch (err) {
      showToast(`Creation failed: ${err.message}`, 'error');
    }
  };

  const toggleAgentStatus = async (id, isActive) => {
    try {
      await api(`/agents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
      showToast(`Agent status updated.`, 'success');
      loadAgents();
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  // 4.9: System Settings
  const loadSettings = async () => {
    try {
      const res = await api('/settings');
      const d = res.data;

      document.getElementById('settings-db-status').textContent = `● Database: ${d.status?.database || 'connected'}`;
    } catch (err) {
      showToast('Could not fetch settings.', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // 5. Utility Functions & Event Listeners
  // ---------------------------------------------------------------------------
  const openModal = (htmlContent) => {
    const container = document.getElementById('modal-container');
    container.innerHTML = `<div class="modal-overlay">${htmlContent}</div>`;
  };

  const closeModal = () => {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
  };

  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${escapeHtml(message)}</span><button style="background:none;border:none;color:#fff;cursor:pointer;">✕</button>`;

    toast.querySelector('button').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-AE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Bind initial DOM events
  const initEvents = () => {
    // Login form submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        login(username, password);
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refresh-view-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        switchView(state.currentView);
        showToast('Dashboard refreshed.', 'info');
      });
    }

    // Add agent button
    const addAgentBtn = document.getElementById('add-agent-btn');
    if (addAgentBtn) addAgentBtn.addEventListener('click', openAddAgentModal);

    // Add KB entry button
    const addKbBtn = document.getElementById('add-kb-entry-btn');
    if (addKbBtn) addKbBtn.addEventListener('click', () => openKbModal());

    // Conversation search/filter
    const convSearchInput = document.getElementById('conv-search-input');
    if (convSearchInput) {
      convSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loadConversations();
      });
    }
    const convFilterBtn = document.getElementById('conv-filter-btn');
    if (convFilterBtn) convFilterBtn.addEventListener('click', loadConversations);
    const convStatusFilter = document.getElementById('conv-status-filter');
    if (convStatusFilter) convStatusFilter.addEventListener('change', loadConversations);

    // Ticket search/filter
    const ticketFilter = document.getElementById('ticket-status-filter');
    if (ticketFilter) ticketFilter.addEventListener('change', loadTickets);
    const ticketRefresh = document.getElementById('ticket-refresh-btn');
    if (ticketRefresh) ticketRefresh.addEventListener('click', loadTickets);

    // SMS Orders search/filter
    const orderStatusFilter = document.getElementById('order-status-filter');
    if (orderStatusFilter) orderStatusFilter.addEventListener('change', loadOrders);
    const orderRefreshBtn = document.getElementById('order-refresh-btn');
    if (orderRefreshBtn) orderRefreshBtn.addEventListener('click', loadOrders);
    const orderSearchInput = document.getElementById('order-search-input');
    if (orderSearchInput) {
      orderSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loadOrders();
      });
    }

    // KB search/filter
    const kbSearch = document.getElementById('kb-search-input');
    if (kbSearch) {
      kbSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loadKnowledgeBase();
      });
    }
    const kbCat = document.getElementById('kb-category-filter');
    if (kbCat) kbCat.addEventListener('change', loadKnowledgeBase);

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  };

  // Run on page load
  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    initAuth();
  });

  return {
    switchView,
    openConversationModal,
    sendConversationReply,
    updateConversationStatus,
    openTicketModal,
    sendTicketReply,
    updateTicketStatus,
    openKbModal,
    saveKbEntry,
    approveKnowledgeEntry,
    deleteKbEntry,
    savePolicyDraft,
    publishPolicy,
    deactivatePolicy,
    openAddAgentModal,
    saveNewAgent,
    toggleAgentStatus,
    loadOrders,
    viewOrderConversation,
    closeModal,
  };
})();
