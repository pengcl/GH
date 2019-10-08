import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'repairDate',
  pure: false
})

@Injectable()
export class RepairDatePipe implements PipeTransform {
  transform(value): any {
    value = value.split('.')[0].replace(/\-/g, '/');
    return value;
  }
}

@Pipe({
  name: 'keys',
  pure: false
})

@Injectable()
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (key) {
        keys.push({key: key, value: value[key]});
      }
    }
    return keys;
  }
}

@Pipe({
  name: 'searchKey',
  pure: false
})

@Injectable()
export class SearchKeyPipe implements PipeTransform {
  transform(value, searchKey): any {
    if (!searchKey) {
      return value;
    }

    return value.replace(searchKey, '<em>' + searchKey + '</em>');
  }
}

@Pipe({
  name: 'picNumber',
  pure: false
})

@Injectable()
export class PicNumberPipe implements PipeTransform {
  transform(num): any {
    let html = '';
    num.toString().split('').forEach((n) => {
      html = html + '<em><img src="/assets/game/mouse/images/num_' + n + '.png"></em>';
    });

    return html;
  }
}
