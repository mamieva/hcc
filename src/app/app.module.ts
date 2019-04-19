import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SignComponent } from './sign/sign.component';

import { AppRoutes } from './app.routing';

import { AuthGuard } from './pages/login/auth.guard';
import { WindowRef } from './services/util/window.ref';
import { AuthenticationService } from './services/authentication.service';
import { SidebarModule } from './sidebar/sidebar.module';
import { HttpClientService } from './services/util/http.client.service';
import { ApiClientService } from './services/util/api.client.service';
import { LoadingService } from './services/util/loading.service';
import { WebsocketService } from './services/util/websocket.service';
import { AppService } from './services/app.service';
import { OperatorService } from './services/operator.service';

@NgModule({
    imports:      [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, { useHash: true }),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        SignComponent,
    ],
    providers:    [
        AuthGuard,
        WindowRef,
        AuthenticationService,
        HttpClientService,
        LoadingService,
        ApiClientService,
        WebsocketService,
        AppService,
        OperatorService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
