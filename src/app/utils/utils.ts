import {genImageUrl} from './browser';
import {Config} from '../config';

export interface GalleryItem {
  /**
   * 远程网址
   *
   * @type {string}
   */
  url?: string;
  /**
   * JavaScript File 对象
   *
   * @type {File}
   */
  file?: File;
  /**
   * 文件标题
   *
   * @type {string}
   */
  title?: string;
  /**
   * 是否允许删除
   *
   * @type {boolean}
   * @default true
   */
  canDelete?: boolean;
}

const isCn = function (str) {
  if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
    return false;
  }
  return true;
};

export function formData(body: object): FormData {
  const _formData: FormData = new FormData();
  for (const kn in body) {
    if (body) {
      _formData.append(kn, body[kn] === undefined ? '' : body[kn]);
    }
  }
  return _formData;
}

export function formDataToUrl(body: object, ifFist?: boolean): string {
  let str = '';
  for (const keyName in body) {
    if (!str && ifFist) {
      str = '?' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    } else {
      str = str + '&' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    }
  }
  return str;
}

export function getIndex(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == value) {
      return i;
    }
  }
}

export function parseImgs(images) {
  let imgs = images;
  if (Array.isArray(imgs)) {
    if (imgs.length > 0) {
      if (typeof imgs[0] === 'string') {
        imgs = (<string[]>imgs).map((url: string) => {
          return {url: url};
        });
      } else {
        imgs = (<GalleryItem[]>imgs).map((item: GalleryItem) => {
          if (item.file) {
            item.url = genImageUrl(item.file);
          }
          return item;
        });
      }
    }
  } else {
    if (typeof imgs === 'string') {
      imgs = [{url: imgs}];
    } else {
      const imgUrl = genImageUrl(imgs);
      if (imgUrl) {
        imgs = [{url: imgUrl}];
      }
    }
  }

  // todo: 永远只返回一个
  // 针对未来可能直接上下个
  return Object.assign([], imgs && (<any[]>imgs).length > 0 ? imgs : []);
}

export function removeByIndex(arr, index) {
  for (let i = 0; i < arr.length; i++) {
    if (i === index) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}

export function validScroll(controls: object) {
  const result = {
    valid: true,
    control: ''
  };
  for (const control in controls) {
    if (controls[control].invalid) {
      result['valid'] = false;
      result['control'] = control;
      return result;
    }
  }
  return result;
}

// 是否更新推荐人 "type_id" type:number,id:string
export function isUpdateReferee(pr, st) {
  if (!pr) {
    return false;
  }

  if (pr && !st) {
    return true;
  }

  if (pr && st) {
    if (pr.split('_')[0] > st.split('_')[0]) {
      return true;
    }
  }
}
