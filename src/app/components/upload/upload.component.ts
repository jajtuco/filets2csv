import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileItem } from 'src/app/models/file-item';
import { CSVService } from 'src/app/services/CSV.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  files: FileItem[] = [];
  hoverZone = false;

  form: FormGroup;


  headerList: string[] = ['MasterCatalogName', 'ImageUrl', 'Name', 'Id', 'Tags'];
  csvName: string = 'Images';

  constructor(public csvService: CSVService, private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
  }


  buildForm() {
    this.form = this.fb.group({
      fileName: ['', [Validators.required]],
      mcName: ['', [Validators.required]],
      imageUrl: [''],
    });
  }


  async downloadCSV() {

    if (this.form.valid) {

      const formValue = this.form.value;
      type headerType = {
        MasterCatalogName: string;
        ImageUrl: string;
        Name: string;
        Id: string;
        Tags: string;
      }
      let filesNames: headerType[] = [];


      this.files.forEach(item => {
        filesNames.push(
          {
            MasterCatalogName: formValue.mcName,
            ImageUrl: formValue.imageUrl + item.fileName,
            Name: item.fileName,
            Id: "",
            Tags: ""
          });
      });



      this.csvService.downloadFile(filesNames, formValue.fileName, this.headerList);


    } else {

      this.form.markAllAsTouched();
    }



  }



  clearFiles() {
    this.files = [];
  }

  deleteFile(idx: number) {

    this.files.splice(idx, 1);

  }

}
