import { AvatarService } from './../services/avatar.service';
import { AuthService } from './../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CameraResultType, CameraSource } from '@capacitor/camera/dist/esm/definitions';
import { Camera } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile: any = null;

  constructor(
    private avatarService: AvatarService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
    ) {
      this.avatarService.getUserProfile().subscribe((data) => {
        this.profile = data;
      })
    }

    async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true});

    }

    async changeImage(){
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });
      console.log(image);

      if(image){
        const loading = await this.loadingController.create();
        await loading.present();

        const result = await this.avatarService.uploadImage(image);
        loading.dismiss();

        if(!result){
          const alert = await this.alertController.create({
            header: 'Upload falhou',
            message: 'Problema com carregamento da foto',
            buttons: ['OK'],
          });
          await alert.present();
        }
      }
    }

}
