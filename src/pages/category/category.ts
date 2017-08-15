import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryDetailPage } from '../category_detail/category_detail';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {

  public categories: any[];

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    const array = [
      { 'name': 'Alimentos', 'icon' : 'ios-restaurant' },
      { 'name': 'Bebidas', 'icon' : 'beer' },
      { 'name': 'Cuidados com a Roupa', 'icon' : 'shirt' },
      { 'name': 'Descartáveis e Utilitários', 'icon' : 'brush' },
      { 'name': 'Higiene e Beleza', 'icon' : 'leaf' },
      { 'name': 'Infantil', 'icon' : 'happy' },
      { 'name': 'Casa e Limpeza', 'icon' : 'home' },
      { 'name': 'Pet Shop', 'icon' : 'paw' },
      { 'name': 'Papelaria', 'icon' : 'attach' }
    ];

    this.categories = array;
  }

  goToCategoryDetailPage(category: string, categoryIcon: string) {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(CategoryDetailPage, {
      catName: category,
      catIcon: categoryIcon
    });
  }
}
