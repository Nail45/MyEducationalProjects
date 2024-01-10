(() => {
  const COLOR_FIRM = '#9873ff';
  const COLOR_GREY = '#b0b0b0';
  const WAIT_TIME_MS = 300;
  const SERVER_URL = 'http://localhost:3000/api/clients';

  let clients;
  async function getClientData(url) {
    const res = await fetch(url);

    if (res.ok) {
      const clientsData = await res.json();
      return clientsData;
    }

    return null
  }

  const filterForm = document.getElementById('filter__form');
  const headerRequest = document.querySelector('.header__request');
  const app = document.getElementById('app');
  const addForm = document.getElementById('add__form');

  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableBody = document.createElement('tbody');
  const tableHeadTr = document.createElement('tr');
  const tableHeadId = document.createElement('th');
  const tableHeadFIO = document.createElement('th');
  const tableHeadCreatedAt = document.createElement('th');
  const tableHeadUpdatedAt = document.createElement('th');
  const tableHeadContacts = document.createElement('th');
  const tableHeadActions = document.createElement('th');
  const tableFIOSymbol = document.createElement('span');
  const inputName = document.querySelector('.add-client__name');
  const inputSurname = document.querySelector('.add-client__last-name');
  const inputLastName = document.querySelector('.add-client__middle-name');
  const load = document.querySelector('.load');
  const loadSave = document.querySelector('.load-save');
  const loadSaveChanged = document.querySelector('.load-save-changed');
  const blueStarLastName = document.querySelector('.blue-star-last-name');
  const blueStarLastNameChanged = document.querySelector('.blue-star-last-name-changed');
  const blueStarName = document.querySelector('.blue-star-name');
  const blueStarNameChanged = document.querySelector('.blue-star-name-changed');
  const btnAddContact = document.querySelector('.btn-add-contact')
  const btnAddContactChanged = document.querySelector('.btn-add-contact-changed')
  const selectWrapAll = document.querySelector('.select-wrap-all')
  const selectWrapAllChanged = document.querySelector('.select-wrap-all-changed')
  const hadLastName = document.querySelector('.had-last-name')
  const hadLastNameChanged = document.querySelector('.had-last-name-changed')
  const hadName = document.querySelector('.had-name')
  const hadNameChanged = document.querySelector('.had-name-changed')
  const hadMiddleName = document.querySelector('.had-middle-name')
  const hadMiddleNameChanged = document.querySelector('.had-middle-name-changed')
  const addClientLastNameChanged = document.querySelector('.add-client__last-name-changed')
  const addClientNameChanged = document.querySelector('.add-client__name-changed')
  const addClientMiddleNameChanged = document.querySelector('.add-client__middle-name-changed')
  const btnCopy = document.querySelector('.btn-copy');
  const btnCopyReady = document.querySelector('.btn-copy-ready');
  const modalChangedClientId = document.querySelector('.modal-id');
  const inputNameChanged = document.querySelector('.add-client__name-changed');
  const inputSurNameChanged = document.querySelector('.add-client__last-name-changed');
  const inputLastNameChanged = document.querySelector('.add-client__middle-name-changed');
  const btnChangedSave = document.querySelector('.btn__changed-save');
  const btnChangedRemove = document.querySelector('.btn__changed-remove');

  let timeout;
  let selectArr = [];
  let inpArr = [];
  let count = [];
  let countChanged = [];
  let sortColumnFlag = 'FIO';
  let sortDirFlag = false;

  tableHeadId.textContent = 'ID';
  tableHeadFIO.textContent = 'Фамилия Имя Отчество';
  tableHeadCreatedAt.textContent = 'Дата и время создания';
  tableHeadUpdatedAt.textContent = 'Последние изменения';
  tableHeadContacts.textContent = 'Контакты';
  tableHeadActions.textContent = 'Действия';

  tableBody.classList.add('table__body');
  tableHeadTr.classList.add('table__tr');
  tableHeadId.classList.add('table__th', 'table-id');
  tableHeadFIO.classList.add('table__th', 'table-fio');
  tableHeadCreatedAt.classList.add('table__th', 'table-date-create');
  tableHeadUpdatedAt.classList.add('table__th', 'table-last-fix');
  tableHeadContacts.classList.add('table__th');
  tableHeadActions.classList.add('table__th');
  tableFIOSymbol.classList.add('symbol');
  table.classList.add('table');

  tableHeadTr.append(tableHeadId);
  tableHeadTr.append(tableHeadFIO);
  tableHeadTr.append(tableHeadCreatedAt);
  tableHeadTr.append(tableHeadUpdatedAt);
  tableHeadTr.append(tableHeadContacts);
  tableHeadTr.append(tableHeadActions);
  tableHeadFIO.append(tableFIOSymbol);

  tableHead.append(tableHeadTr);
  table.append(tableHead);
  table.append(tableBody);

  app.append(table);

  const icon = {
    'VK': `<svg class='svg-vk' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 
    12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 
    10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 
    10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 
    9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 
    10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 
    10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 
    2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 
    6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 
    6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 
    5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 
    6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 
    7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 
    5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 
    5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 
    7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
    </g>
    </svg>`,
    'FB': `<svg class='svg-fb' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 
    4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 
    9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 
    9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
    </g>
    </svg>`,
    'Phone': `<svg class='svg-phone' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <circle cx="8" cy="8" r="8" fill="#9873FF"/>
    <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 
    10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 
    5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 
    12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
    </g>
    </svg>`,
    'Email': `<svg class='svg-mail' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 
    0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 
    11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 
    6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 
    6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
    </svg>`,
    'Other': `<svg class='svg-other'  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 
    0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 
    13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 
    6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 
    8.995 5 9.99Z" fill="#9873FF"/>
    </svg>`
  }

  function resetData() {
    inputName.value = ''
    inputSurname.value = ''
    inputLastName.value = ''
    selectWrapAll.innerHTML = ''
    count.length = 0;
    countChanged.length = 0;
    if (count.length < 10) {
      btnAddContact.removeAttribute('disabled', '')
    }
  }
  document.querySelector('.btn-close-new').addEventListener('click', () => resetData())
  document.querySelector('.btn__cansel-close').addEventListener('click', () => resetData())

  function getClientItem() {
    tableBody.innerHTML = '';

    let copyClients = [...clients];

    for (oneClient of copyClients) {
      oneClient.name = oneClient.name.slice(0, 1).toUpperCase() + oneClient.name.slice(1);
      oneClient.surname = oneClient.surname.slice(0, 1).toUpperCase() + oneClient.surname.slice(1);
      oneClient.lastName = oneClient.lastName.slice(0, 1).toUpperCase() + oneClient.lastName.slice(1);
      oneClient.FIO = oneClient.surname + ' ' + oneClient.name + ' ' + oneClient.lastName;

      inputSurname.addEventListener('input', () => {
        if (inputSurname.value !== '') {
          blueStarLastName.classList.add('had-up-last-name')
          hadLastName.style.display = 'block'
        } else {
          blueStarLastName.classList.remove('had-up-last-name')
          hadLastName.style.display = 'none'
        }
      })
      inputName.addEventListener('input', () => {
        if (inputName.value !== '') {
          blueStarName.classList.add('had-up-name')
          hadName.style.display = 'block'
        } else {
          blueStarName.classList.remove('had-up-name')
          hadName.style.display = 'none'
        }
      })

      inputLastName.addEventListener('input', () => {
        if (inputLastName.value !== '') {
          hadMiddleName.style.display = 'block'
        } else {
          hadMiddleName.style.display = 'none'
        }
      })

      blueStarLastNameChanged.classList.add('had-up-last-name-changed')
      hadLastNameChanged.style.display = 'block'
      blueStarNameChanged.classList.add('had-up-name-changed')
      hadNameChanged.style.display = 'block'

      addClientLastNameChanged.addEventListener('input', () => {
        if (addClientLastNameChanged.value !== '') {
          blueStarLastNameChanged.classList.add('had-up-last-name-changed')
          hadLastNameChanged.style.display = 'block'
        } else {
          blueStarLastNameChanged.classList.remove('had-up-last-name-changed')
          hadLastNameChanged.style.display = 'none'
        }
      })
      addClientNameChanged.addEventListener('input', () => {
        if (addClientNameChanged.value !== '') {
          blueStarNameChanged.classList.add('had-up-name-changed')
          hadNameChanged.style.display = 'block'
        } else {
          blueStarNameChanged.classList.remove('had-up-name-changed')
          hadNameChanged.style.display = 'none'
        }
      })

      addClientMiddleNameChanged.addEventListener('input', () => {
        if (addClientMiddleNameChanged.value !== '') {
          hadMiddleNameChanged.style.display = 'block'
        } else {
          hadMiddleNameChanged.style.display = 'none'
        }
      })
    }
    // Фильтрация

    if (headerRequest.value.trim() !== '') copyClients = filter(copyClients, 'FIO', headerRequest.value)

    // Сортировка

    copyClients = copyClients.sort(function sortClient(a, b) {

      let sort = a[sortColumnFlag] < b[sortColumnFlag]
      if (sortDirFlag === false) {
        sort = a[sortColumnFlag] > b[sortColumnFlag];
      }
      if (sort) {
        return -1
      }
    })

    for (const oneClient of copyClients) {
      const newTr = createClient(oneClient)
      tableBody.append(newTr)
    }
  }

  async function loadClients() {
    const clientsData = await getClientData(SERVER_URL);

    if (clientsData !== null) {
      clients = [...clientsData];
      getClientItem();
    } else {
      console.log('Студенты не загрузились');
    }
  }

  loadClients();

  btnCopy.addEventListener('click', () => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + `${oneClient.id}`);
    btnCopyReady.style.display = 'block';
    setTimeout(() => btnCopyReady.style.display = 'none', 3000);
  })
  async function openChangeModal(id) {

    async function serverGetClientOne(id) {
      const res = await fetch(`${SERVER_URL}/${id}`, {
        method: 'GET',
        headers: {
          'content-type': 'aplication/json'
        },
      })

      let data = await res.json()
      return data
    }

    let serverData = await serverGetClientOne(id);

    if (serverData) oneClient = serverData;

    countChanged.length = 0;
    modalChangedClientId.textContent = 'ID:' + ' ' + oneClient.id;

    inputNameChanged.value = oneClient.name;
    inputSurNameChanged.value = oneClient.surname;
    inputLastNameChanged.value = oneClient.lastName;

    selectWrapAllChanged.innerHTML = ''
    for (let i = 0; i < oneClient.contacts.length; i++) {
      countChanged.push(1)
      createFormAddContact(selectWrapAllChanged, oneClient.contacts[i])
    }

    if (countChanged.length > 9) btnAddContactChanged.setAttribute('disabled', '')

    if (countChanged.length < 10) btnAddContactChanged.removeAttribute('disabled', '')

    btnChangedSave.dataset.edit = `${oneClient.id}`;
    document.querySelector('.btn-fixed').dataset.editSvg = `${oneClient.id}`;
    btnChangedRemove.dataset.edit = `${oneClient.id}`;

    btnChangedRemove.addEventListener('click', async () => await serverDeleteClient(btnChangedRemove.dataset.edit))

    if (oneClient.lastName) {
      hadMiddleNameChanged.style.display = 'block'
    } else {
      hadMiddleNameChanged.style.display = 'none'
    }

  }
  tableHeadId.addEventListener('click', function () {
    sortColumnFlag = 'id';
    sortDirFlag = !sortDirFlag;
    if (!sortDirFlag) {
      tableHeadId.classList.add('down');
    } else {
      tableHeadId.classList.remove('down');
    }
    tableHeadId.style.color = COLOR_FIRM;
    tableHeadFIO.style.color = COLOR_GREY;
    tableHeadCreatedAt.style.color = COLOR_GREY;
    tableHeadUpdatedAt.style.color = COLOR_GREY;
    getClientItem()
  })

  tableHeadFIO.addEventListener('click', function () {
    sortColumnFlag = 'FIO';
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag) {
      tableHeadFIO.classList.add('down');
      tableFIOSymbol.classList.remove('return');
    } else {
      tableHeadFIO.classList.remove('down');
      tableFIOSymbol.classList.add('return');
    }
    tableHeadId.style.color = COLOR_GREY;
    tableHeadFIO.style.color = COLOR_FIRM;
    tableHeadCreatedAt.style.color = COLOR_GREY;
    tableHeadUpdatedAt.style.color = COLOR_GREY;
    getClientItem()
  })

  tableHeadCreatedAt.addEventListener('click', function () {
    sortColumnFlag = 'createdAt';
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag) {
      tableHeadCreatedAt.classList.add('down');
    } else {
      tableHeadCreatedAt.classList.remove('down');
    }
    tableHeadCreatedAt.style.color = COLOR_FIRM;
    tableHeadId.style.color = COLOR_GREY;
    tableHeadFIO.style.color = COLOR_GREY;
    tableHeadUpdatedAt.style.color = COLOR_GREY;
    getClientItem()
  })

  tableHeadUpdatedAt.addEventListener('click', function () {
    sortColumnFlag = 'updatedAt';
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag) {
      tableHeadUpdatedAt.classList.add('down');
    } else {
      tableHeadUpdatedAt.classList.remove('down');
    }
    tableHeadUpdatedAt.style.color = COLOR_FIRM;
    tableHeadCreatedAt.style.color = COLOR_GREY;
    tableHeadId.style.color = COLOR_GREY;
    tableHeadFIO.style.color = COLOR_GREY;
    getClientItem()
  })


  if (window.location.hash !== '') {
    const myModal = new bootstrap.Modal('#modalChangedClient');
    myModal.show(openChangeModal(window.location.hash.slice(1)));
  }

  function createClient(oneClient) {
    const clientTr = document.createElement('tr');
    const clientId = document.createElement('th');
    const clientFIO = document.createElement('th');
    const clientCreatedAt = document.createElement('th');
    const clientCreatedAtWrap = document.createElement('div');
    const clientCreatedAtDay = document.createElement('span');
    const clientCreatedAtHour = document.createElement('span');
    const clientUpdatedAt = document.createElement('th');
    const clientUpdatedAtWrap = document.createElement('div');
    const clientUpdatedAtDay = document.createElement('span');
    const clientLastHour = document.createElement('span');
    const clientContacts = document.createElement('th');
    const clientContactsWrap = document.createElement('div');
    const clientAction = document.createElement('th');
    const clientfixed = document.createElement('button');
    const clientRemove = document.createElement('button');
    const btnDelRemove = document.querySelector('.btn__del-remove');
    const changedForm = document.getElementById('changed__form');

    const createdAtMinute = new Date(oneClient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedAtMinute = new Date(oneClient.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const allContact = document.createElement('div');
    allContact.classList.add('all-contact')
    allContact.textContent = '+' + `${oneClient.contacts.length - 4}`

    if (oneClient.contacts.length <= 4) allContact.style.display = 'none'

    for (let i = 0; i < oneClient.contacts.length; i++) {
      oneClient.contacts[i]['icon'] = icon[oneClient.contacts[i]['type']]
      let contact = document.createElement('div');
      contact.classList.add('contact')
      contact.innerHTML = icon[oneClient.contacts[i]['type']];
      contact.dataset.number = i
      clientContactsWrap.append(contact)
      tippy(contact, {
        content: oneClient.contacts[i]['value'],
        interactive: true,
        theme: 'light',
      });
      for (let i = 4; i < oneClient.contacts.length; i++) {
        if (contact.dataset.number == [i]) contact.style.display = 'none'
      }

      allContact.addEventListener('click', () => {
        contact.style.display = 'block'
        allContact.style.display = 'none'
      })
    }
    clientContactsWrap.append(allContact)

    clientId.textContent = oneClient.id;
    clientFIO.textContent = oneClient.FIO;
    clientfixed.textContent = 'Изменить';
    clientRemove.textContent = 'Удалить';

    clientTr.classList.add('client__tr')
    clientId.classList.add('client__id');
    clientFIO.classList.add('client__th');
    clientCreatedAt.classList.add('client__th');
    clientCreatedAtWrap.classList.add('client__th-time-create')
    clientCreatedAtDay.classList.add('client__day');
    clientCreatedAtHour.classList.add('client__hour');
    clientUpdatedAt.classList.add('client__th');
    clientUpdatedAtWrap.classList.add('client__th-time-changed')
    clientUpdatedAtDay.classList.add('client__day');
    clientLastHour.classList.add('client__hour');
    clientContacts.classList.add('client__th', 'client-contacts');
    clientAction.classList.add('client__action');
    clientfixed.classList.add('client__th', 'btn-fixed', 'default-svg-firm');
    clientRemove.classList.add('client__th', 'btn-remove', 'default-svg-red');
    clientContactsWrap.classList.add('client-Contacts-Wrap')

    clientCreatedAtDay.textContent = new Date(oneClient.createdAt).toLocaleDateString();
    clientCreatedAtHour.textContent = createdAtMinute;
    clientUpdatedAtDay.textContent = new Date(oneClient.updatedAt).toLocaleDateString();
    clientLastHour.textContent = updatedAtMinute;

    clientCreatedAtWrap.append(clientCreatedAtDay);
    clientCreatedAtWrap.append(clientCreatedAtHour);
    clientCreatedAt.append(clientCreatedAtWrap);
    clientUpdatedAtWrap.append(clientUpdatedAtDay);
    clientUpdatedAtWrap.append(clientLastHour);
    clientUpdatedAt.append(clientUpdatedAtWrap);
    clientAction.append(clientfixed);
    clientAction.append(clientRemove);
    clientContacts.append(clientContactsWrap)

    clientTr.append(clientId);
    clientTr.append(clientFIO);
    clientTr.append(clientCreatedAt);
    clientTr.append(clientUpdatedAt);
    clientTr.append(clientContacts);
    clientTr.append(clientAction);

    clientRemove.dataset['bsToggle'] = 'modal';
    clientRemove.dataset['bsTarget'] = '#modalDeleteClient';

    clientfixed.dataset['bsToggle'] = 'modal';
    clientfixed.dataset['bsTarget'] = '#modalChangedClient';

    clientRemove.addEventListener('click', () => {
      btnDelRemove.dataset.rem = `${oneClient.id}`;
      clientRemove.dataset.remSvg = `${oneClient.id}`;
    })

    btnDelRemove.addEventListener('click', async () => await serverDeleteClient(btnDelRemove.dataset.rem))

    async function serverDeleteClient(id) {
      if (clientRemove.dataset.remSvg === id) {
        clientRemove.classList.add('red-load');
        clientRemove.classList.remove('default-svg-red');
      }
      const res = await fetch(`${SERVER_URL}/${id}`, {
        method: 'DELETE'
      })
      let data = await res.json()

      return data
    }
    clientfixed.addEventListener('click', () => openChangeModal(oneClient.id));

    changedForm.addEventListener('submit', async e => {
      e.preventDefault();
      loadSaveChanged.style.display = 'inline-block';

      selectArr.length = 0;
      document.querySelectorAll('.select__contact').forEach((Element) => selectArr.push(Element.value))

      inpArr.length = 0
      document.querySelectorAll('.select__contact-value').forEach((Element) => inpArr.push(Element.value))

      let ObjChanged = []

      for (let i = 0; i < selectArr.length; i++) {
        ObjChanged.push({
          type: selectArr[i],
          value: inpArr[i]
        })
      }

      await serverChangedClient(btnChangedSave.dataset.edit, ObjChanged)

    })

    let autocompleteFIO = []
    for (let i = 0; i < clients.length; i++) {
      autocompleteFIO.push(clients[i].FIO)
    }

    function autocomplete(inp, arr) {
      /* функция автозаполнения принимает два аргумента,
      элемент текстового поля и массив возможных значений автозаполнения: */
      let currentFocus;
      /* выполнение функции, когда кто-то пишет в текстовом поле: */
      inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /* закрыть все уже открытые списки значений автозаполнения */
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /* создайте элемент DIV, который будет содержать элементы (значения): */
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /* добавьте элемент DIV в качестве дочернего элемента контейнера автозаполнения: */
        this.parentNode.appendChild(a);
        /* для каждого элемента в массиве... */
        for (i = 0; i < arr.length; i++) {
          /* проверьте, начинается ли элемент с тех же букв, что и значение текстового поля: */
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /* создайте элемент DIV для каждого соответствующего элемента: */
            b = document.createElement("DIV");
            /* сделайте соответствующие буквы жирным шрифтом: */
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /* вставьте поле ввода, которое будет содержать значение текущего элемента массива: */
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /* выполнение функции, когда кто-то нажимает на значение элемента (элемент DIV): */
            b.addEventListener("click", function (e) {
              /* вставьте значение для текстового поля автозаполнения: */
              inp.value = this.getElementsByTagName("input")[0].value;
              /* закройте список значений автозаполнения,
              (или любые другие открытые списки значений автозаполнения : */
              closeAllLists();
            });
            a.appendChild(b);
          }
        }
      });
      /* выполнение функции нажимает клавишу на клавиатуре: */
      inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /* Если нажата клавиша со стрелкой вниз,
          увеличение текущей переменной фокуса: */
          currentFocus++;
          /* и сделать текущий элемент более видимым: */
          addActive(x);
        } else if (e.keyCode == 38) { //вверх
          /* Если нажата клавиша со стрелкой вверх,
          уменьшите текущую переменную фокуса: */
          currentFocus--;
          /* и сделать текущий элемент более видимым: */
          addActive(x);
        } else if (e.keyCode == 13) {
          /* Если нажата клавиша ENTER, предотвратите отправку формы, */
          e.preventDefault();
          if (currentFocus > -1) {
            /* и имитировать щелчок по элементу "active": */
            if (x) x[currentFocus].click();
          }
        }
      });
      function addActive(x) {
        /* функция для классификации элемента как "active": */
        if (!x) return false;
        /* начните с удаления "активного" класса для всех элементов: */
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*добавить класса "autocomplete-active": */
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /* функция для удаления "активного" класса из всех элементов автозаполнения: */
        for (let i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /* закройте все списки автозаполнения в документе,
        кроме того, который был передан в качестве аргумента: */
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /* выполнение функции, когда кто-то щелкает в документе: */
      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }

    autocomplete(document.querySelector('.header__request'), autocompleteFIO);

    async function serverChangedClient(id, Obj) {
      if (clientfixed.dataset.editSvg === id) {
        clientfixed.classList.add('firm-load');
        clientfixed.classList.remove('default-svg-firm');
      }
      const res = await fetch(`${SERVER_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          name: inputNameChanged.value,
          surname: inputSurNameChanged.value,
          lastName: inputLastNameChanged.value,
          contacts: [...Obj]
        })
      })

      let data = await res.json();

      return data

    }
    return clientTr
  }
  // Фильтрация
  function filter(arr, prop, value) {
    return arr.filter(function (oneClient) {
      if (oneClient[prop].toLowerCase().includes(value.trim().toLowerCase())) {
        return true
      }
    })
  }

  filterForm.addEventListener('submit', function (e) {
    e.preventDefault();
  })

  headerRequest.addEventListener('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => getClientItem(), WAIT_TIME_MS);
  })

  async function serverAddClient(Obj) {
    loadSave.style.display = 'inline-block';
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(Obj)
    })

    let data = await res.json()

    return data
  }


  async function serverGetClient() {
    load.style.display = 'block';
    const res = await fetch(SERVER_URL, {
      method: 'GET',
      headers: {
        'content-type': 'aplication/json'
      },
    })
    addClientBtn();
    load.style.display = 'none';

    let data = await res.json()
    return data
  }

  let serverData = serverGetClient();

  if (serverData) clients = serverData;

  function addClientBtn() {
    const addBtn = document.createElement('button');
    addBtn.classList.add('add-btn');
    addBtn.textContent = 'Добавить клиента';
    app.append(addBtn);

    addBtn.dataset['bsToggle'] = 'modal';
    addBtn.dataset['bsTarget'] = '#modalAddClient';
  }

  function createFormAddContact(wrap, contact = null) {

    const selectWrap = document.createElement('div')
    const selectContact = document.createElement('select');
    const selectContactPhone = document.createElement('option');
    const selectContactOther = document.createElement('option');
    const selectContactEmail = document.createElement('option');
    const selectContactVk = document.createElement('option');
    const selectContactFb = document.createElement('option');
    const selectLabelContact = document.createElement('label')
    const selectContactValueInp = document.createElement('input');
    const btnDelContact = document.createElement('button');
    const selectLabelContactError = document.createElement('span')
    const im = new Inputmask("+7 (999) 999-99-99");

    selectContact.classList.add('select__contact');
    selectWrap.classList.add('select-wrap')
    selectContactPhone.classList.add('select__contact-phone');
    selectContactOther.classList.add('select__contact-other');
    selectContactEmail.classList.add('select__contact-email');
    selectContactVk.classList.add('select__contact-vk');
    selectContactFb.classList.add('select__contact-fb');
    selectContactValueInp.classList.add('select__contact-value', 'form-control')
    btnDelContact.classList.add('btn-del-contact');
    selectLabelContact.classList.add('select__contact-value-wrap')
    selectLabelContactError.classList.add('select__contact-value-error')

    selectContactPhone.value = 'Phone'
    selectContactOther.value = 'Other'
    selectContactEmail.value = 'Email'
    selectContactVk.value = 'VK'
    selectContactFb.value = 'FB'
    selectContactValueInp.placeholder = 'Введите данные контакта'
    btnDelContact.setAttribute('type', 'button')

    selectContactPhone.textContent = 'Телефон'
    selectContactOther.textContent = 'Другое'
    selectContactEmail.textContent = 'Email'
    selectContactVk.textContent = 'VK'
    selectContactFb.textContent = 'FB'
    selectLabelContactError.textContent = 'Необходимо заполнить все данные'

    tippy(btnDelContact, {
      content: "Удалить контакт",
      interactive: true,
      theme: 'light',
    });

    selectContact.append(selectContactPhone);
    selectContact.append(selectContactOther);
    selectContact.append(selectContactEmail);
    selectContact.append(selectContactVk);
    selectContact.append(selectContactFb);
    selectLabelContact.append(selectContactValueInp);
    selectLabelContact.append(btnDelContact);
    selectWrap.append(selectLabelContactError);
    selectWrap.append(selectContact);
    selectWrap.append(selectLabelContact);
    wrap.append(selectWrap);

    if (contact) {
      selectContact.value = contact.type;
      selectContactValueInp.value = contact.value;
      btnDelContact.style.display = 'flex'
      selectContactValueInp.style.width = '228' + 'px';
      if (contact.type === 'Phone') {
        selectContactValueInp.type = 'tel'
        im.mask(selectContactValueInp);
      } else if (contact.type === 'Email') {
        Inputmask.remove(selectContactValueInp);
        selectContactValueInp.type = 'Email'
      } else {
        Inputmask.remove(selectContactValueInp);
        selectContactValueInp.type = 'text'
      }
    }
    let widthWind = document.querySelector('body').offsetWidth;


    if (widthWind > 576) {
      selectContactValueInp.addEventListener('input', () => {
        if (selectContactValueInp.value !== '') {
          btnDelContact.style.display = 'flex'
          selectContactValueInp.style.width = '228' + 'px';
        } else {
          btnDelContact.style.display = 'none'
          selectContactValueInp.style.width = '255' + 'px';
        }
      })
    }

    if (widthWind < 576) {
      selectContactValueInp.addEventListener('input', () => {
        if (selectContactValueInp.value !== '') {
          btnDelContact.style.display = 'flex'
          selectContactValueInp.style.width = '140' + 'px';
        } else {
          btnDelContact.style.display = 'none'
          selectContactValueInp.style.width = '170' + 'px';
        }
      })
    }
    const choices = new Choices(selectContact, {
      position: 'bottom',
      searchEnabled: false,
      itemSelectText: '',
    });

    btnDelContact.addEventListener('click', () => {
      selectWrap.remove()
      count.pop(1);
      countChanged.pop(1);
      if (count.length < 10) {
        btnAddContact.removeAttribute('disabled', '')
      }
      if (countChanged.length < 10) {
        btnAddContactChanged.removeAttribute('disabled', '')
      }
    })
    selectContact.addEventListener('change', (e) => {
      if (e.target.value === 'Phone') {
        selectContactValueInp.type = 'tel'
        im.mask(selectContactValueInp);
      } else if (e.target.value === 'Email') {
        Inputmask.remove(selectContactValueInp);
        selectContactValueInp.type = 'Email'
      } else {
        Inputmask.remove(selectContactValueInp);
        selectContactValueInp.type = 'text'
      }
    })
  }

  btnAddContact.addEventListener('click', () => {
    count.push(1);
    if (count.length > 9) btnAddContact.setAttribute('disabled', '')

    createFormAddContact(selectWrapAll)

  })

  btnAddContactChanged.addEventListener('click', () => {
    countChanged.push(1);
    if (countChanged.length > 9) btnAddContactChanged.setAttribute('disabled', '')

    createFormAddContact(selectWrapAllChanged)
  })

  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const errorLastName = document.querySelector('.error-last-name')
    const errorName = document.querySelector('.error-name')


    const clientsObj = {
      name: inputName.value,
      surname: inputSurname.value,
      lastName: inputLastName.value,
      contacts: [],
    }

    selectArr.length = 0;
    document.querySelectorAll('.select__contact').forEach((Element) => selectArr.push(Element.value))

    inpArr.length = 0
    document.querySelectorAll('.select__contact-value').forEach((Element) => {
      if (Element.value.trim() === '') {
        document.querySelector('.select__contact-value-error').style.display = 'block'
        Element.classList.add('is-invalid')
      }
      Element.addEventListener('input', () => {
        document.querySelector('.select__contact-value-error').style.display = 'none'
        Element.classList.remove('is-invalid')
      })
      inpArr.push(Element.value)
    })

    for (let i = 0; i < selectArr.length; i++) {
      clientsObj.contacts.push({
        type: selectArr[i],
        value: inpArr[i]
      })
    }

    if (inputName.value.trim() === '') {
      errorName.style.display = 'block'
      inputName.classList.add('is-invalid')
    }
    inputName.addEventListener('input', () => {
      errorName.style.display = 'none'
      inputName.classList.remove('is-invalid')
    })

    if (inputSurname.value.trim() === '') {
      errorLastName.style.display = 'block'
      inputSurname.classList.add('is-invalid')
    }
    inputSurname.addEventListener('input', () => {
      errorLastName.style.display = 'none'
      inputSurname.classList.remove('is-invalid')
    })

    let serverDataObj = await serverAddClient(clientsObj);

    clients.push(serverDataObj)
  })
})()