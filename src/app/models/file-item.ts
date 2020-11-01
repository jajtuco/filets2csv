export class FileItem {

    public fileBuffer: ArrayBuffer | string;
    
    public size: number;
    public fileName: string;
    public url: string;

    constructor( archivo: File ) {
        
        this.size = archivo.size;

        var reader = new FileReader();

        reader.readAsDataURL(archivo);
        reader.onload = (event) => { // called once readAsDataURL is completed
            this.fileBuffer =  event.target.result;
        }


        this.fileName = archivo.name;
    }

}