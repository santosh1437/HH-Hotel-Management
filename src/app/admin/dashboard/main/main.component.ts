import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexFill,
  ApexResponsive,
  ApexTheme,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { StatisticCard2Component } from '@shared/components/statistic-card2/statistic-card2.component';
import { MatCardModule } from '@angular/material/card';
import { AttendanceChartComponent } from '@shared/components/attendance-chart/attendance-chart.component';
import { ChartCard4Component } from '@shared/components/chart-card4/chart-card4.component';
import { EventCardComponent } from '@shared/components/event-card/event-card.component';
import { LocksService } from 'app/service/locks.service';
import { take } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export type chartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  legend: ApexLegend;
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  responsive: ApexResponsive[];
  labels: string[];
  theme: ApexTheme;
  series2: ApexNonAxisChartSeries;
};


interface BookingData {
  room_id: string;
  room_type_name: string;
  booking_date: string;
  occupied_rooms: number;
}

interface DayBooking {
  date: Date;
  bookings: BookingData[];
  totalOccupiedRooms: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    NgScrollbar,
    StatisticCard2Component,
    AttendanceChartComponent,
    ChartCard4Component,
    EventCardComponent,
    MatTableModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
    
  ],
})
export class MainComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  @ViewChild('calenderModal',{static: true}) calenderModal!: TemplateRef<any> 
  public performanceRateChartOptions!: Partial<chartOptions>;

  title2 = 'Admission chart';
  subtitle2 = 'New admission in the last 5 years in the school';

  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading: boolean = false;

  monthlyChannelOverAllBookings: any[] = []; // original data
  tableData: any[] = [];                     // transformed data
  dynamicColumns: string[] = [];             // for mat-table
  channelSet = new Set<string>(); 
  channelGroups: string[] = [];
  displayedColumns: string[] = [];
  headerRow1: string[] = [];
  headerRow2: string[] = [];
 roomTypeGroups: string[] = [];
  displayedRoomColumns: string[] = [];
  tableRoomData: any[] = [];
  monthlyRoomOverAllBookings: any[] = [];
  dataSourceRoom = new MatTableDataSource<any>();
  roomTableData: any[] = [];

  breadscrums = [
    {
      title: 'Dashboad',
      items: [],
      active: 'Dashboard 1',
    },
  ];
  channelOverBookings: any;
  overallSummary: any;
  DayBookingData: any[]= [];
  // monthlyRoomOverAllBookings: any;
  constructor(
    private lockService: LocksService,
        private modal: NgbModal,
    
  ) {
    //constructor
  }

  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() description: string = '';
  @Input() img: string = '';
  @Input() arrowIcon: string = '';

  ngOnInit() {
    this.chart3();
    this.getPMSReport();
  }

  // Events
  events = [
    {
      day: 'Tuesday',
      date: 4,
      month: 'Jan',
      title: 'Science Fair',
      timeStart: '11:00 AM',
      timeEnd: '12:30 PM',
      status: 'Today',
    },
    {
      day: 'Friday',
      date: 12,
      month: 'Jan',
      title: 'Guest Speaker',
      timeStart: '11:00 AM',
      timeEnd: '12:30 PM',
      status: 'In 8 days',
    },
    {
      day: 'Sunday',
      date: 18,
      month: 'Jan',
      title: 'Art Exhibition Opening',
      timeStart: '01:00 PM',
      timeEnd: '02:30 PM',
      status: 'In 11 days',
    },
  ];

  private chart3() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Students',
          data: [113, 120, 130, 120, 125, 119],
        },
      ],
      chart: {
        height: 360,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      colors: ['#51E298'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 1,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Students',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  examList = [
    {
      title: 'Standard 1',
      dateRange: '23-03-2022 | 28-03-2022',
      statusClass: 'colorStyle1',
    },
    {
      title: 'Standard 2',
      dateRange: '10-03-2022 | 15-03-2022',
      statusClass: 'colorStyle2',
    },
    {
      title: 'Standard 3',
      dateRange: '03-04-2022 | 10-04-2022',
      statusClass: 'colorStyle3',
    },
    {
      title: 'Standard 4',
      dateRange: '11-05-2022 | 15-05-2022',
      statusClass: 'colorStyle4',
    },
    {
      title: 'Standard 5',
      dateRange: '17-05-2022 | 21-05-2022',
      statusClass: 'colorStyle1',
    },
    {
      title: 'Standard 6',
      dateRange: '23-05-2022 | 28-05-2022',
      statusClass: 'colorStyle2',
    },
    {
      title: 'Standard 7',
      dateRange: '11-06-2022 | 15-06-2022',
      statusClass: 'colorStyle3',
    },
  ];

  // Sport Achievements start
  sportData = [
    {
      id: 1,
      name: 'John Doe',
      assignedCoach: 'Jacob Ryan',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Cricket',
      img: 'assets/images/user/user1.jpg',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      assignedCoach: 'Rajesh',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Boxing',
      img: 'assets/images/user/user2.jpg',
    },
    {
      id: 3,
      name: 'Airi Satou',
      assignedCoach: 'Jay Soni',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Tennis',
      img: 'assets/images/user/user3.jpg',
    },
    {
      id: 4,
      name: 'Angelica Ramos',
      assignedCoach: 'John Deo',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Hockey',
      img: 'assets/images/user/user4.jpg',
    },
    {
      id: 5,
      name: 'Ashton Cox',
      assignedCoach: 'Megha Trivedi',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Yoga',
      img: 'assets/images/user/user5.jpg',
    },
    {
      id: 6,
      name: 'Cara Stevens',
      assignedCoach: 'Sarah Smith',
      email: 'test@gmail.com',
      date: '12/05/2016',
      sportName: 'Gymnastics',
      img: 'assets/images/user/user8.jpg',
    },
    // Add more items as needed
  ];

  ChannelOvearallBookingsColumnDefinitions = [
    { def: 'channel_name', label: 'Channel Name', type: 'text' , visible:'true'},
    { def: 'total_bookings', label: 'Bookings', type: 'text', visible:'true' },
    { def: 'total_room_rate', label: 'Amount', type: 'text', visible:'true' },
    { def: 'total_paid', label: 'Paid', type: 'text', visible:'true' },
    { def: 'total_due', label: 'Due', type: 'text', visible:'true' },
  ];

  RoomOvearAllBookingsColumnDefinitions = [
    { def: 'room_type_name', label: 'Room Name', type: 'text' , visible:'true'},
    { def: 'total_bookings', label: 'Bookings', type: 'text', visible:'true' },
    { def: 'total_room_rate', label: 'Amount', type: 'text', visible:'true' },
    { def: 'total_paid', label: 'Paid', type: 'text', visible:'true' },
    { def: 'total_due', label: 'Due', type: 'text', visible:'true' },
  ];

  dataSource = new MatTableDataSource<any>([]);
  dataSource1 = new MatTableDataSource<any>([]);

  // Sport Achievements end

  // New Student List start

  studentData = [
    {
      id: 1,
      name: 'John Deo',
      phone: '(123)123456',
      address: '9946 Baker Rd. Marysville',
      branch: 'Mechanical',
      dateOfAdmission: '12-08-2019',
      img: 'assets/images/user/user8.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 2,
      name: 'Jens Brincker',
      phone: '(123)123456',
      address: '193 S. Harrison Drive',
      branch: 'Science',
      dateOfAdmission: '10-08-2019',
      img: 'assets/images/user/user2.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 3,
      name: 'Mark Hay',
      phone: '(123)123456',
      address: '8949 Golf St. Palm Coast',
      branch: 'Commerce',
      dateOfAdmission: '05-08-2019',
      img: 'assets/images/user/user3.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 4,
      name: 'Anthony Davie',
      phone: '(123)123456',
      address: '23 Ohio Court Alexandria',
      branch: 'M.B.A.',
      dateOfAdmission: '05-11-2019',
      img: 'assets/images/user/user4.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 5,
      name: 'Alan Gilchrist',
      phone: '(123)123456',
      address: '338 North Cleveland Rd',
      branch: 'Civil',
      dateOfAdmission: '07-09-2019',
      img: 'assets/images/user/user6.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 6,
      name: 'Sue Woodger',
      phone: '(123)123456',
      address: '753 Forest Lane',
      branch: 'M.C.A.',
      dateOfAdmission: '12-10-2019',
      img: 'assets/images/user/user7.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 7,
      name: 'David Perry',
      phone: '(123)123456',
      address: '7909 W. Sunnyslope St.',
      branch: 'Computer',
      dateOfAdmission: '04-11-2019',
      img: 'assets/images/user/user8.jpg',
      feesReceipt: 'download link',
    },
    {
      id: 8,
      name: 'Sneha Pandit',
      phone: '(123)123456',
      address: '7361 Dunbar Street',
      branch: 'Mechanical',
      dateOfAdmission: '11-01-2019',
      img: 'assets/images/user/user9.jpg',
      feesReceipt: 'download link',
    },
  ];

  studentColumnDefinitions = [
    { def: 'name', label: 'Student Name', type: 'text', },
    { def: 'phone', label: 'Phone', type: 'phone' },
    { def: 'address', label: 'Address', type: 'address' },
    { def: 'branch', label: 'Branch', type: 'text' },
    { def: 'dateOfAdmission', label: 'Date Of Admission', type: 'date' },
    { def: 'feesReceipt', label: 'Fees Receipt', type: 'file' },
    { def: 'actions', label: 'Actions', type: 'actionBtn' },
  ];

   getChannelColumns(): string[] {
    return this.ChannelOvearallBookingsColumnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  getRoomColumns(): string[] {
  return this.RoomOvearAllBookingsColumnDefinitions
    .filter(col => col.type !== 'check' && col.type !== 'actionBtn')
    .map(col => col.def);
}

  // New Student List start
  getPMSReport(){
    this.lockService.getPMSReport().pipe(take(1)).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.channelOverBookings = res.ChannelOvearallBookings;
        this.dataSource.data = this.channelOverBookings;
        this.dataSource1.data = res.RoomOvearAllBookings;
        this.monthlyChannelOverAllBookings  = res.monthlyChannelOverAllBookings;
        this.monthlyRoomOverAllBookings = res.monthlyRoomOverAllBookings;
        this.overallSummary = res.OverAllSummary;
        this.DayBookingData = res.CalendarDateBookings;
        this.transformDataForTable();
        this.transformRoomTableData();
        this.updateCalendar();
        console.log("this.overallSummary", this.overallSummary);
      },
      error:(err)=>console.log(err)
    })
  }

    transformDataForTable(): void {
    const data = this.monthlyChannelOverAllBookings;
    const grouped = new Map<string, any>();
    const channels = new Set<string>();

    data.forEach(entry => {
      const month = entry.month;
      const channel = entry.channel_name;

      channels.add(channel);

      if (!grouped.has(month)) {
        grouped.set(month, { month });
      }

      const row = grouped.get(month);
      row[`${channel}_bookings`] = entry.total_bookings;
      row[`${channel}_rate`] = entry.total_room_rate;
    });

    this.channelGroups = Array.from(channels);
    this.tableData = Array.from(grouped.values());

    // Header Rows
    this.headerRow1 = ['monthGroup', ...this.channelGroups.map(c => c + '_group')];
    this.headerRow2 = ['month', ...this.channelGroups.flatMap(c => [c + '_bookings', c + '_rate'])];
    this.displayedColumns = this.headerRow2;
  }

   transformRoomTableData(): void {
  const groupedMap = new Map<string, any>();
  const roomSet = new Set<string>();

  this.monthlyRoomOverAllBookings.forEach(item => {
    const { month, room_type_name, total_bookings, total_room_rate } = item;
    roomSet.add(room_type_name);

    if (!groupedMap.has(month)) {
      groupedMap.set(month, { month });
    }

    const row = groupedMap.get(month);
    row[room_type_name + '_bookings'] = total_bookings;
    row[room_type_name + '_rate'] = total_room_rate;
  });

  this.roomTypeGroups = Array.from(roomSet);
  this.roomTableData = Array.from(groupedMap.values());
}


// ****************calender start**************************
  currentDate = new Date();
  currentMonth = '';
  currentYear = 0;
  calendarDays: DayBooking[] = [];
  selectedDay: DayBooking | null = null;
  
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  updateCalendar() {
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendarDays();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayBooking[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dayBookings = this.getBookingsForDate(currentDay);
      const totalOccupied = dayBookings.reduce((sum, booking) => sum + booking.occupied_rooms, 0);
      
      days.push({
        date: currentDay,
        bookings: dayBookings,
        totalOccupiedRooms: totalOccupied,
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.getTime() === today.getTime()
      });
    }
    
    this.calendarDays = days;
  }

  getBookingsForDate(date: Date): BookingData[] {
    const dateString = date.toISOString().split('T')[0];
    return this.DayBookingData.filter((booking:any) => booking.booking_date === dateString);
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
    this.selectedDay = null;
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
    this.selectedDay = null;
  }

  selectDay(day: DayBooking) {
    if (day.bookings.length > 0) {
      this.selectedDay = day;
    }
    this.modal.open(this.calenderModal, { size: 'lg' })
  }

// ******************calender end***************************

  

    onContextMenu(event: MouseEvent, item: any) {
      event.preventDefault();
      this.contextMenuPosition = {
        x: `${event.clientX}px`,
        y: `${event.clientY}px`,
      };
      if (this.contextMenu) {
        this.contextMenu.menuData = { item };
        this.contextMenu.menu?.focusFirstItem('mouse');
        this.contextMenu.openMenu();
      }
    }
}
