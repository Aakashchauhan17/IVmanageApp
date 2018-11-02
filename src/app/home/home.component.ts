import { Component, OnInit } from "@angular/core";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { Image } from "tns-core-modules/ui/image";
import { BarcodeScanner, ScanOptions } from 'nativescript-barcodescanner';
import {isAndroid, isIOS} from "platform";
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { Kinvey, CacheStore, NetworkStore, SyncStore} from 'kinvey-nativescript-sdk';
Kinvey.init({
    appKey: 'kid_S1_ETDMjm',
    appSecret: '860ca56e067c4935a00a58c84390cab2'
});

interface Register{
    username: string;
    room_no: string;
    remaining_time: string;
}
interface names {
    _id;
    test:string;
    r_number: string;
    time: number;
}
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})

export class HomeComponent implements OnInit {
    public contactName: Array<any> = [];
    standings: any;
    dataStore: CacheStore<names>;
    min: number;
    public input: Register;
    public myItems: Array<SegmentedBarItem>;
    public selectedIndex = 0;
    public visibility1 = true;
    public visibility2 = false;
    public visibility3 = false;

    constructor(private barcodeScanner: BarcodeScanner) {
        this.input = Object();
        this.dataStore = Kinvey.DataStore.collection<names>('liveServ');
        var query = new Kinvey.Query();
        query.ascending('time')

        const subscription = this.dataStore.find(query)
            .subscribe(data => {
              this.contactName = data;
              // console.log(this.contactName);

              console.log(this.min);
             // console.log(Math.min(this.contactName);
            }, (error) => {
              alert(error)
            }, () => {
              // ...
            });
        this.standings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        this.myItems = [];
        for (let i = 1; i <= 3; i++) {
            const item = new SegmentedBarItem();
            if(i == 1){item.title = "Patients ";}
            else if(i==2){item.title = "Add New";}
            else if(i==3){item.title = "Sign Out";}
            
            this.myItems.push(item);}
    }
    public onSelectedIndexChange(value) {
        let segmetedBar = <SegmentedBar>value.object;
      
        this.selectedIndex = value;
        if(segmetedBar.selectedIndex == 0){
            this.visibility1 = true;
            this.visibility2 = false;
            this.visibility3 = false;
        } else if(segmetedBar.selectedIndex==1){
            this.visibility1 = false;
           this.visibility2 = true;
           this.visibility3 = false;
        }
        else{
            this.visibility1 = false;
            this.visibility2 = false;
            this.visibility3 = true;

            const confirmOptions: ConfirmOptions = {
                title: "Sign Out",
                message: "Do you really want to Sign Out?",
                okButtonText: "Sure!",
                cancelButtonText: "Cancel"
            };
            confirm(confirmOptions)
                .then((result) => {
                    // result can be true/false/undefined
                    console.log(result);
                    if(result == false){
                        console.log("Good");
                        this.visibility1 = true;
                        this.visibility2 = false;
                        this.visibility3 = false;
                    }
                    else{
                        console.log("Bbye");
                        
                    }
                });
        }
    }
    
    buttonsub() {
        console.log(this.input.username);
        const entity = {_id:null, test:this.input.username, r_number:this.input.room_no, time:parseInt(this.input.remaining_time)};
        const promise = this.dataStore.save(entity)
          .then((entity: {}) => {
            // ...
          })
          .catch((error: Kinvey.BaseError) => {
            // ...
          });
          const promise1 = this.dataStore.sync()
        .then(() => {
        
        })
    }
    ngOnInit(): void {
        Kinvey.User.login("admin","admin");
        const activeUser = Kinvey.User.getActiveUser();
activeUser.registerForLiveService()
  .then(() => {
      console.log("You got it");
      const books = Kinvey.DataStore.collection('liveServ', Kinvey.DataStoreType.Network);
        books.subscribe({
            onMessage: (m) => {
                // console.log(m);
                alert(m.test+ "," + m.r_number+ "," + m.time);
                this.contactName.push(m);
               // this.contactName.sort.apply(this.contactName.map(function(temp){return temp.time;}));
                setTimeout(() => {
                    // alert("change IV for "+m.test);
                    const confirmOptions: ConfirmOptions = {
                        title: m.r_number,
                        message: m.test + " is ready for an I.V change",
                        okButtonText: "On My Way",
                        cancelButtonText: "Dismiss"
                    };
                    confirm(confirmOptions)
                        .then((result) => {
                            console.log(result);
                        });
                }, m.time*60*1000);
                console.log(this.contactName.length);
                this.min = Math.min.apply(Math,this.contactName.map(function(item){return item.time;}));
            },
            onStatus: (s) => {
                console.log("onStatus");
                // handle status events, which pertain to this collection
            },
            onError: (e) => {
                console.log("error in onError")
                // handle error events, which pertain to this collection
            }
        })
            .then(() => {console.log("Success");  
        
        })
            .catch(e => { console.log("error") });
        
       
  })
  .catch(err => {
      console.log("failed")
    // handle error
  });
    }
    public onScanResult(evt) {
        // console.log(evt.object);
        console.log(`onScanResult: ${evt.text} (${evt.format})`);
      }
    
      public scanTapped(): void {
        let scan = () => {
          this.barcodeScanner.scan({
            formats: "QR_CODE, EAN_13",
            beepOnScan: true,
            reportDuplicates: true,
            preferFrontCamera: false
            // continuousScanCallback: scanResult => {
            //   console.log("result: " + JSON.stringify(scanResult));
            //   this.barcodeScanner.stop();
            // }
          })
              .then(result => console.log(JSON.stringify(result)))
              .catch(error => console.log(error));
        };
    
        this.barcodeScanner.hasCameraPermission()
            .then(granted => granted ? scan() : this.barcodeScanner.requestCameraPermission()
            .then(() => scan()))
            .catch(() => {
              this.barcodeScanner.requestCameraPermission()
                  .then(() => scan());
            });
      }
}
