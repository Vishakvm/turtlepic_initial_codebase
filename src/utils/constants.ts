/*
 * Constants
 */

import { ApexOptions } from 'apexcharts';

export const INDIVIDUAL = 'individual';
export const AGENCY = 'agency';
export const LOGIN = 'login';
export const REGISTER = 'register';
export const GUEST = 'guest';
export const SUPERADMIN = 'superadmin';
export const ACCEPTED = 'accepted'
export const REQUESTED = 'requested'
export const SECONDARY = 'secondary'
export const NEXT = 'next'
export const PREV = 'prev'
export const LAST = 'last'
export const FIRST = 'first'

export const AGENCY_MEMBER = 'agency_member'

export const TRANSFERRED = 'transferred'

export const WORKSPACE = 'workspace';
export const CLIENT = 'client';

export const BUYPLAN = 'buy-plan';
export const TRYPLAN = 'try-plan';

export const PUBLISHED = 'published';
export const PENDING = 'pending';
export const VERIFIED = 'verified';
export const REJECTED = 'rejected';
export const UPLOADED = 'uploaded';

export const EVENTPANEL = 'eventpanel';

export const ALL = 'all';
export const CUSTOM = 'custom';
export const FAVOURITES = 'favourites';
export const PHOTOS = 'photos';
export const VIDEOS = 'videos';

export const DONUT = 'donut';
export const AREA = 'area';
export const BAR = 'bar';

export const documents = [
  {
    id: 1,
    name: 'Ram Mohan',
    contact: ['354324324', 'hello@gmail'],
    gst: 543543543,
    pan: 43432423,
    address: 'Sector 53 Gurugram',
    date: '4/35/43',
    status: '',
  },
];
export const AgencyUsersList = [
  {
    id: 1,
    name: 'Ram Mohan',
    contact: ['354324324', 'hello@gmail'],
    events: '4',
    members: '20',
    joined_on: '01-06-2022',
    kyc_status: 'Verified',
    more: '',
  },
];
export const discount = [
  {
    id: 1,
    name: 'Ram Mohan',
    coupon_code: '354324324',
    type: 'Agency',
    usage: '20',
    offer_amount: '40 GB',
    expiry: '10-06-2022',
    more: '',
  },
];

const series = {
  monthDataSeries: {
    count: [0, 500, 740, 550, 670, 500, 640],
    timeline: ['', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    timelineMonth: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
};

// LineChart Config

export const downloadsChart: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  labels: series.monthDataSeries.timeline,
  xaxis: {
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.1,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.4,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  title: {
    text: 'Total downloads',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#02c2d9'],
  markers: {
    size: 5,
    colors: '#02c2d9',
    strokeColors: '#02c2d9',
    hover: {
      size: 10,
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  grid: {
    borderColor: '#000',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'total downloads',
      data: series.monthDataSeries.count,
    },
  ],
};

export const totalSelfieSearchChart: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  labels: series.monthDataSeries.timeline,
  xaxis: {
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.1,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.4,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  title: {
    text: 'Total Selfie Searches',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#02c2d9'],
  markers: {
    size: 5,
    colors: '#02c2d9',
    strokeColors: '#02c2d9',
    hover: {
      size: 10,
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  grid: {
    borderColor: '#000',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'total selfie searches',
      data: series.monthDataSeries.count,
    },
  ],
};
export const planDistribution: ApexOptions = {
  series: [
    {
      name: 'Free',
      data: [44, 55, 41, 67],
    },
    {
      name: 'Paid',
      data: [13, 23, 20, 8],
    },
  ],
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    type: 'bar',
    height: 350,
    stacked: true,
    zoom: {
      enabled: true,
    },
  },
  colors: ['#02c2d9', '#111111'],
  title: {
    text: 'Plan distribution',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },

  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '50%',
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  xaxis: {
    type: 'category',
    categories: ['Standard', 'Pro', 'Elite', 'Custom'],
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  legend: {
    position: 'right',
    offsetY: 40,
  },
};

export const totalAgenciesOnboardedChart: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  labels: series.monthDataSeries.timelineMonth,
  xaxis: {
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.1,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.4,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  title: {
    text: 'Total agencies onboarded',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#02c2d9'],
  markers: {
    size: 5,
    colors: '#02c2d9',
    strokeColors: '#02c2d9',
    hover: {
      size: 10,
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  grid: {
    borderColor: '#000',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'total agencies onboarded',
      data: series.monthDataSeries.count,
    },
  ],
};

export const averageConsumptionOfStorageInPaidAccountsChart: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  labels: series.monthDataSeries.timelineMonth,
  xaxis: {
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.1,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.4,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  title: {
    text: 'Average consumption of storage in paid accounts',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#02c2d9'],
  markers: {
    size: 5,
    colors: '#02c2d9',
    strokeColors: '#02c2d9',
    hover: {
      size: 10,
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  grid: {
    borderColor: '#000',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'average consumption of storage in paid accounts',
      data: series.monthDataSeries.count,
    },
  ],
};
export const averageReachOfBrandChart: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  labels: series.monthDataSeries.timelineMonth,
  xaxis: {
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.1,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.4,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  tooltip: {
    followCursor: false,
    theme: 'dark',
    x: {
      show: false,
    },
  },
  title: {
    text: 'Average reach of brand',
    align: 'left',
    style: {
      fontSize: '17px',
    },
  },
  subtitle: {
    text: 'Last month',
    align: 'left',
    style: {
      fontSize: '13px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#02c2d9'],
  markers: {
    size: 5,
    colors: '#02c2d9',
    strokeColors: '#02c2d9',
    hover: {
      size: 10,
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  grid: {
    borderColor: '#000',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'average reach of brand',
      data: series.monthDataSeries.count,
    },
  ],
};

export const recentKYCRequestList = [
  {
    name: 'Chitra Studios',
    location: 'Gurgaon',
    status: 'Pending',
  },
  {
    name: 'Karan Sidhu Photos',
    location: 'Delhi',
    status: 'Declined',
  },
  {
    name: 'WedMeGood Studios',
    location: 'Noida',
    status: 'Verified',
  },
];

export const agencyUsers = [
  {
    name: 'Chitra Studios',
    plan: 'Standard',
  },
  {
    name: 'Rahul Mehra Studio',
    plan: 'Pro',
  },
  {
    name: 'Styleme Studios',
    plan: 'Elite',
  },
];

export const individualUsers = [
  {
    name: 'Anjali Gupta',
    plan: 'Free',
  },
  {
    name: 'Saloni Agarwal',
    plan: 'Free',
  },
  {
    name: 'Neha Sharma',
    plan: 'Free',
  },
];

export const mostEventsList = [
  {
    name: 'Chitra Studios',
    count: '18',
  },
  {
    name: 'Karan Sidhu Photography',
    count: '10',
  },
  {
    name: 'WedMeGood',
    count: '5',
  },
];

export const userActivityOptions: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '45%',
      },
    },
  },

  subtitle: {
    text: 'In last 30 days - ',
    align: 'right',
    style: {
      fontSize: '16px',
      fontWeight: '500',
    },
    offsetX: -35,
    offsetY: 20,
  },
  dataLabels: {
    enabled: false,
  },
  labels: ['Active Users: 3060', 'Inactive Users: 306'],
  series: [10, 90],
  colors: ['#f7da75', '#02c2d9'],
  stroke: {
    show: false,
  },
  legend: {
    labels: {
      colors: '#fff',
    },
    offsetX: 0,
    offsetY: 30,
  },
};

export const eventTypeOptions: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '45%',
      },
    },
  },

  subtitle: {
    text: 'In last 30 days - ',
    align: 'right',
    style: {
      fontSize: '16px',
      fontWeight: '500',
    },
    offsetX: -15,
    offsetY: 20,
  },
  dataLabels: {
    enabled: false,
  },
  labels: ['Workspace: 50', 'Client: 30'],
  series: [10, 90],
  colors: ['#f7da75', '#02c2d9'],
  stroke: {
    show: false,
  },
  legend: {
    labels: {
      colors: '#fff',
    },
    offsetX: 0,
    offsetY: 30,
  },
};

export const geographicChartOptionsAdmin: ApexOptions = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '45%',
      },
    },
  },

  dataLabels: {
    enabled: false,
  },
  labels: ['Delhi (NCR)', 'Haryana', 'U.P', 'Others'],
  series: [50, 25, 15, 10],
  colors: ['#7dd78d', '#f7da75', '#02c2d9', '#325638'],
  stroke: {
    show: false,
  },
  legend: {
    labels: {
      colors: '#fff',
    },
  },
};
