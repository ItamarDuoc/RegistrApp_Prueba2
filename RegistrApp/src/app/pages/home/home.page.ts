import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';

  constructor(
    private storageService: StorageService,
    private qrScanner: QRScanner,
    private router: Router
  ) {}

  async ngOnInit() {
    this.storageService.get('user').then((Response) => {
      if (Response) {
        this.userName = Response;
      } else {
        this.userName = '';
        this.router.navigate(['/login']);
      }
    });
  }

  scanQR() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Escaneado:', text);
            this.qrScanner.hide();
            scanSub.unsubscribe();
          });
          this.qrScanner.show();
        } else if (status.denied) {
          console.error('Permiso de cámara denegado');
        } else {
          console.error('Permiso de cámara no otorgado');
        }
      })
      .catch((e: any) => console.error('Error al preparar el escáner QR', e));
  }

  async logout() {
    await this.storageService.remove('user');
    this.router.navigate(['/login']);
  }
}
