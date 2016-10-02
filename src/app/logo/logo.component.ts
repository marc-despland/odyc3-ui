import { Component, OnInit , EventEmitter, Input, Output} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'logo',
  templateUrl: 'logo.component.html',
  styleUrls: ['logo.component.css']
})
export class LogoComponent implements OnInit {
  @Input() id;
  @Input() selected;
  @Input() logos;
  @Output() onSelect = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
  }

  onClick() {
    this.onSelect.emit(this.id);
  }

}
