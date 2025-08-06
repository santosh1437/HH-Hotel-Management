import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface RouteInfo {
  path: string;
  title: string;
  iconType: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  badge: string;
  badgeClass: string;
  role: string[];
  submenu: RouteInfo[];
}


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Embedded translation object
  private translations: any = {
    MENUITEMS: {
      MAIN: { TEXT: 'Main' },
      DASHBOARD: {
        TEXT: 'Dashboard',
        LIST: {
          DASHBOARD1: 'Dashboard 1',
          // DASHBOARD2: 'Dashboard 2',
          // 'TEACHER-DASHBOARD': 'Teacher Dashboard',
          // 'STUDENT-DASHBOARD': 'Student Dashboard'
        }
      },
      // 'FROUNT-OFFICE': {
      //   TEXT: 'Frount Office',
      //   LIST: {
      //     ADMISSION: 'Admission Inquiry',
      //     VISITORS: 'Visitors Book',
      //     COMPLAINTS: 'Complaints'
      //   }
      // },
      // 'DIGITAL-LOCKS': {
      //   TEXT: 'Digital Locks',
      //   LIST: {
      //     DEVICES: 'Devices',
      //   }
      // },
    }
  };

  // Embedded routes object
  private routes: RouteInfo[] = [
    {
      path: '',
      title: 'MENUITEMS.MAIN.TEXT',
      iconType: '',
      icon: '',
      class: '',
      groupTitle: true,
      badge: '',
      badgeClass: '',
      role: ['All'],
      submenu: []
    },
    {
      path: '',
      title: 'Dashboard',
      iconType: 'material-icons-outlined',
      icon: 'space_dashboard',
      class: 'menu-toggle',
      groupTitle: false,
      badge: '',
      badgeClass: '',
      role: ['Admin'],
      submenu: [
        {
          path: '/admin/dashboard/main',
          title: 'Dashboard',
          iconType: '',
          icon: '',
          class: 'ml-menu',
          groupTitle: false,
          badge: '',
          badgeClass: '',
          role: [''],
          submenu: []
        },
      ]
    },
    // {
    //   path: '',
    //   title: 'MENUITEMS.FROUNT-OFFICE.TEXT',
    //   iconType: 'material-icons-outlined',
    //   icon: 'display_settings',
    //   class: 'menu-toggle',
    //   groupTitle: false,
    //   badge: '',
    //   badgeClass: '',
    //   role: ['Admin'],
    //   submenu: [
    //     {
    //       path: '/admin/frount-office/admission-inquiry',
    //       title: 'MENUITEMS.FROUNT-OFFICE.LIST.ADMISSION',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     },
    //     {
    //       path: '/admin/frount-office/visitors',
    //       title: 'MENUITEMS.FROUNT-OFFICE.LIST.VISITORS',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     },
    //     {
    //       path: '/admin/frount-office/complaints',
    //       title: 'MENUITEMS.FROUNT-OFFICE.LIST.COMPLAINTS',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     }
    //   ]
    // },
    // {
    //   path: '',
    //   title: 'Digital Locks',
    //   iconType: 'material-icons-outlined',
    //   icon: 'display_settings',
    //   class: 'menu-toggle',
    //   groupTitle: false,
    //   badge: '',
    //   badgeClass: '',
    //   role: ['Admin'],
    //   submenu: [
    //     {
    //       path: '/digital-locks/devices',
    //       title: 'Devices',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     },
    //     {
    //       path: '/digital-locks/properties',
    //       title: 'Properties',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     },
    //     {
    //       path: '/digital-locks/bookings',
    //       title: 'Bookings',
    //       iconType: '',
    //       icon: '',
    //       class: 'ml-menu',
    //       groupTitle: false,
    //       badge: '',
    //       badgeClass: '',
    //       role: [''],
    //       submenu: []
    //     }
    //   ]
    // }
    {
      path: '/digital-locks/devices',
      title: 'Digital Locks',
      iconType: 'material-icons-outlined',
      icon: 'lock',
      class: '',
      groupTitle: false,
      badge: '',
      badgeClass: '',
      role: ['Admin'],
      submenu: []
    },
    {
      path: '/digital-locks/properties',
      title: 'Properties',
      iconType: 'material-icons-outlined',
      icon: 'business',
      class: '',
      groupTitle: false,
      badge: '',
      badgeClass: '',
      role: ['Admin'],
      submenu: []
    },
    {
      path: '/digital-locks/bookings',
      title: 'Bookings',
      iconType: 'material-icons-outlined',
      icon: 'book',
      class: '',
      groupTitle: false,
      badge: '',
      badgeClass: '',
      role: ['Admin'],
      submenu: []
    },
    {
      path: '/digital-locks/staff',
      title: 'Staff',
      iconType: 'material-icons-outlined',
      icon: 'groups',
      class: '',
      groupTitle: false,
      badge: '',
      badgeClass: '',
      role: ['Admin'],
      submenu: []
    },
    // Add more routes if needed...
  ];

  constructor() {}

  // Public method to get fully translated menu
  getRouteInfo(): Observable<RouteInfo[]> {
    const translatedRoutes = this.parseRoutes(this.routes);
    return of(translatedRoutes);
  }

  private parseRoutes(routes: RouteInfo[]): RouteInfo[] {
    return routes.map(route => {
      const parsedRoute = { ...route };
      parsedRoute.title = this.resolveTranslation(parsedRoute.title);

      if (route.submenu?.length) {
        parsedRoute.submenu = this.parseRoutes(route.submenu);
      }

      return parsedRoute;
    });
  }

  private resolveTranslation(key: string): string {
    const keys = key.split('.');
    let value = this.translations;
    for (const k of keys) {
      if (value && k in value) {
        value = value[k];
      } else {
        return key; // fallback
      }
    }
    return typeof value === 'string' ? value : key;
  }
}
