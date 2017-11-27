import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform{
    transform(items, field: string, args:string): any {
        if (!items || !args) {
            return items;
        }
        return items.filter(item => item[field].toLowerCase().indexOf(args.toLowerCase()) !== -1);
    }
}