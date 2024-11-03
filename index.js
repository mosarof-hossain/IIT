// DOM Elements
const dashboardButton = document.getElementById('dashboardButton');
const machinesButton = document.getElementById('machinesButton');
const ipManageButton = document.getElementById('ipManageButton');
const maintenanceButton = document.getElementById('maintenanceButton');
const dashboard = document.getElementById('dashboard');
const machines = document.getElementById('machines');
const ipManage = document.getElementById('ipManage');
const maintenanceManage = document.getElementById('maintenanceManage');
const machineTable = document.getElementById('machineTable');
const ipTable = document.getElementById('ipTable');
const maintenanceTable = document.getElementById('maintenanceTable');
const machineModal = document.getElementById('machineModal');
const machineForm = document.getElementById('machineForm');
const ipModal = document.getElementById('ipModal');
const ipForm = document.getElementById('ipForm');
const maintenanceModal = document.getElementById('maintenanceModal');
const maintenanceForm = document.getElementById('maintenanceForm');
const searchMachine = document.getElementById('searchMachine');
const searchIP = document.getElementById('searchIP');
const searchMaintenance = document.getElementById('searchMaintenance');

// Counts
const totalMachinesCount = document.getElementById('totalMachinesCount');
const totalIPCount = document.getElementById('totalIPCount');
const totalMaintenanceCount = document.getElementById('totalMaintenanceCount');

// Data Arrays
let machinesData = [];
let ipData = [];
let maintenanceData = [];
let editMode = false;
let currentEditTag = null;

// Navigation Buttons
dashboardButton.addEventListener('click', () => toggleView(dashboard));
machinesButton.addEventListener('click', () => toggleView(machines));
ipManageButton.addEventListener('click', () => toggleView(ipManage));
maintenanceButton.addEventListener('click', () => toggleView(maintenanceManage));

function toggleView(view) {
  dashboard.classList.add('hidden');
  machines.classList.add('hidden');
  ipManage.classList.add('hidden');
  maintenanceManage.classList.add('hidden');
  view.classList.remove('hidden');
}

// Open/Close Modals
function openMachineModal() {
  machineModal.classList.remove('hidden');
  machineForm.reset();
  editMode = false;
}

function closeModal() {
  machineModal.classList.add('hidden');
  ipModal.classList.add('hidden');
  maintenanceModal.classList.add('hidden');
}

// Update Counts Display
function updateCounts() {
  totalMachinesCount.textContent = `Total Machines: ${machinesData.length}`;
  totalIPCount.textContent = `Total IPs: ${ipData.length}`;
  totalMaintenanceCount.textContent = `Total Maintenance Records: ${maintenanceData.length}`;
}

// Add Machine
machineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const tag = document.getElementById('machineTag').value;
  const name = document.getElementById('machineName').value;
  const type = document.getElementById('machineType').value;
  const imageInput = document.getElementById('machineImage');
  let imageURL = '';

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageURL = e.target.result;
      if (editMode) {
        updateMachine(currentEditTag, tag, name, type, imageURL);
      } else {
        addMachine(tag, name, type, imageURL);
      }
      displayMachines();
      closeModal();
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    if (editMode) {
      updateMachine(currentEditTag, tag, name, type, imageURL);
    } else {
      addMachine(tag, name, type, imageURL);
    }
    displayMachines();
    closeModal();
  }
});

// CRUD for Machines
function addMachine(tag, name, type, imageURL) {
  machinesData.push({ tag, name, type, imageURL });
  updateCounts();
}

function updateMachine(oldTag, newTag, name, type, imageURL) {
  const machine = machinesData.find(machine => machine.tag === oldTag);
  machine.tag = newTag;
  machine.name = name;
  machine.type = type;
  machine.imageURL = imageURL;
  updateCounts();
}

function deleteMachine(tag) {
  machinesData = machinesData.filter(machine => machine.tag !== tag);
  displayMachines();
  updateCounts();
}

function displayMachines(filteredMachines = null) {
  const dataToShow = filteredMachines || machinesData;
  machineTable.innerHTML = '';
  dataToShow.forEach(machine => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${machine.tag}</td>
      <td class="border p-2"><img src="${machine.imageURL || 'default.jpg'}" alt="Machine Image" class="w-16 h-16 object-cover rounded"></td>
      <td class="border p-2">${machine.name}</td>
      <td class="border p-2">${machine.type}</td>
      <td class="border p-2">
        <button onclick="startEditMachine('${machine.tag}')" class="text-blue-500">Edit</button>
        <button onclick="deleteMachine('${machine.tag}')" class="text-red-500">Delete</button>
      </td>
    `;
    machineTable.appendChild(row);
  });
}

// Start editing a machine
function startEditMachine(tag) {
  const machine = machinesData.find(machine => machine.tag === tag);
  document.getElementById('machineTag').value = machine.tag;
  document.getElementById('machineName').value = machine.name;
  document.getElementById('machineType').value = machine.type;
  document.getElementById('modalTitle').textContent = 'Edit Machine';
  currentEditTag = tag;
  editMode = true;
  openMachineModal();
}

// CRUD for IP Management
ipForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const ip = document.getElementById('ipAddress').value;
  const name = document.getElementById('ipMachineName').value;
  const tag = document.getElementById('ipMachineTag').value;

  addIP(ip, name, tag);
  displayIPs();
  closeModal();
});

function addIP(ip, name, tag) {
  ipData.push({ ip, name, tag });
  updateCounts();
}

function deleteIP(tag) {
  ipData = ipData.filter(ip => ip.tag !== tag);
  displayIPs();
  updateCounts();
}

function displayIPs(filteredIPs = null) {
  const dataToShow = filteredIPs || ipData;
  ipTable.innerHTML = '';
  dataToShow.forEach(ip => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${ip.ip}</td>
      <td class="border p-2">${ip.name}</td>
      <td class="border p-2">${ip.tag}</td>
      <td class="border p-2">
        <button onclick="deleteIP('${ip.tag}')" class="text-red-500">Delete</button>
      </td>
    `;
    ipTable.appendChild(row);
  });
}

// Open IP Modal
function openIPModal() {
  ipModal.classList.remove('hidden');
  ipForm.reset();
}

// CRUD for Maintenance Management
maintenanceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('maintenanceMachineName').value;
  const tag = document.getElementById('maintenanceMachineTag').value;
  const status = document.getElementById('maintenanceStatus').value;

  addMaintenance(name, tag, status);
  displayMaintenance();
  closeModal();
});

function addMaintenance(name, tag, status) {
  maintenanceData.push({ name, tag, status });
  updateCounts();
}

function deleteMaintenance(tag) {
  maintenanceData = maintenanceData.filter(maint => maint.tag !== tag);
  displayMaintenance();
  updateCounts();
}

function displayMaintenance(filteredMaintenance = null) {
  const dataToShow = filteredMaintenance || maintenanceData;
  maintenanceTable.innerHTML = '';
  dataToShow.forEach(maint => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${maint.name}</td>
      <td class="border p-2">${maint.tag}</td>
      <td class="border p-2">${maint.status}</td>
      <td class="border p-2">
        <button onclick="deleteMaintenance('${maint.tag}')" class="text-red-500">Delete</button>
      </td>
    `;
    maintenanceTable.appendChild(row);
  });
}

// Search Functionality
searchMachine.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMachines = machinesData.filter(machine => 
    machine.tag.toLowerCase().includes(searchTerm) || 
    machine.name.toLowerCase().includes(searchTerm)
  );
  displayMachines(filteredMachines);
});

searchIP.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredIPs = ipData.filter(ip => 
    ip.ip.toLowerCase().includes(searchTerm) || 
    ip.name.toLowerCase().includes(searchTerm) ||
    ip.tag.toLowerCase().includes(searchTerm)
  );
  displayIPs(filteredIPs);
});

searchMaintenance.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMaintenance = maintenanceData.filter(maint => 
    maint.name.toLowerCase().includes(searchTerm) || 
    maint.tag.toLowerCase().includes(searchTerm) || 
    maint.status.toLowerCase().includes(searchTerm)
  );
  displayMaintenance(filteredMaintenance);
});

// Initialize Counts
updateCounts();
