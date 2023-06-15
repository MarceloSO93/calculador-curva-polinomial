import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CoordinatesDialogComponentComponent } from './coordinates-dialog-component/coordinates-dialog-component.component';
import { Graphic } from './models/Graphic';
import { ApiService } from './services/api.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild("canvas", { static: true }) elemento: ElementRef;
  response: Graphic;
  // newCoordinates = [[1.0, 2.0],[2.0, 3.5],[3.0, 5.1],[4.0, 6.5],[5.0, 7.1],[6.0, 8.5]];
  // newCoordinates = [[1.0, 2.0],[2.0, 3.5],[3.0, 5.1],[4.0, 6.5],[5.0, 7.1]];
  // newCoordinates = [[1.0, 2.0],[2.0, 3.5],[3.0, 5.1]];

  startCoordinates = [{ x: 1.0, y: 2.0, }, { x: 2.0, y: 3.5 }, { x: 3.0, y: 5.1 }, { x: 4.0, y: 6.5 }];
  chart: any = [];
  typeChart: number = 1;
  coordinates: any[] = [];
  dataSource: MatTableDataSource<any>;
  functionLaw: string = "";

  polinomial: boolean = true;
  exponential: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog) {
    Chart.register(...registerables, zoomPlugin)
  }

  ngOnInit() {
    // this.dataSource = new MatTableDataSource(this.startCoordinates);
    // for (const coordinate of this.startCoordinates) {
    //   this.coordinates.push([coordinate.x, coordinate.y]);
    // }
  }

  definePolinomial(): void {
    if (this.polinomial) {
      this.polinomial = true;
      this.exponential = false;
    }
  }

  definEexponential(): void {
    if (this.exponential) {
      this.polinomial = false;
      this.exponential = true;
    }
  }
  openFormDialog() {
    this.dialog.open(CoordinatesDialogComponentComponent).afterClosed().subscribe(result => {
      if (result) {
        this.coordinates.push(result);
        this.dataSource = new MatTableDataSource(this.coordinates);
      }
    });
  }

  editRecord(element: MatTableDataSource<any>) {
    console.log("element: ", element);
    this.dialog.open(CoordinatesDialogComponentComponent, { data: element }).afterClosed().subscribe(result => {
      const index = this.coordinates.indexOf(element);
      if (result) {
        this.coordinates.splice(index, 1, result);
        this.dataSource = new MatTableDataSource(this.coordinates);
      }
    });
  }

  deleteelement(element: MatTableDataSource<any>) {
    const index = this.coordinates.indexOf(element);
    if (index > -1) {
      this.coordinates.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.coordinates);
    }
  }



  sendCoordinates(): void {
    let newCoordinates = [];
    console.log("this.coordinates: ", this.coordinates)
    for (const coordinate of this.coordinates) {
      newCoordinates.push([coordinate.x, coordinate.y]);
    }

    if (this.polinomial === true && this.exponential === false) {

      this.apiService.calculatePolinomialCurve(newCoordinates)
        .subscribe(response => {
          this.response = response;
          this.setChart(this.response);
          this.functionLaw = this.response.functionLaw;
        });
      this.chart.destroy();
    } else if (this.polinomial === false && this.exponential === true) {
      this.apiService.calculateExponentialCurve(newCoordinates)
        .subscribe(response => {
          this.response = response;
          this.setChart(this.response);
          this.functionLaw = this.response.functionLaw;
        });
      this.chart.destroy();
    }


  }

  setChart(gaphic: Graphic) {

    const xValues = [];
    const yValues = [];
    const pointsVisibilityX = [];
    const pointsVisibilityY = [];


    for (const element of gaphic.coordinates) {
      xValues.push(element.x);
      yValues.push(element.y);
      if (element.visible) {
        pointsVisibilityX.push(element.x);
        pointsVisibilityY.push(element.y);
      }
    }

    const data = {
      labels: xValues,
      datasets: [
        {
          label: 'Y',
          data: yValues,
          fill: false,
          // borderColor: 'red',
          tension: 0.4,
          backgroundColor: 'rgba(0, 0, 255, 100)',
          borderColor: 'rgba(39, 140, 245, 0.8)',
          borderWidth: 2,
          pointRadius: (context) => {
            if (pointsVisibilityY.includes(context.parsed.y)) {
              if (pointsVisibilityX.includes(context.parsed.x))
                return 5;
            }
            return 0;
          },
          // pointColor: 'red',
          pointBackgroundColor: 'rgba(245, 40, 145, 0.8)'
        },

      ]
    };

    this.chart = new Chart(this.elemento.nativeElement, {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          },
          y: {
            type: 'linear',
            position: 'left',
            ticks: {
              stepSize: 5
            }
          }
        },
        aspectRatio: 3,
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }
      }
    });

  }

}
