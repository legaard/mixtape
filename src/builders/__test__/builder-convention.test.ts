import * as Builders from '../index';
import { PrimitiveType } from '../../primitive-type';
import { TypeBuilder } from '../../type-builder';

describe('BuilderConvention', () => {
    test('should have builder for each primitive type', () => {
        // Arrange
        Object.keys(PrimitiveType).forEach(t => {
            const builder = Object.keys(Builders)
                .map(k => new Builders[k]() as TypeBuilder<any>)
                .find(b => b.type === t);

            expect(builder).not.toBeUndefined();
        });
    });
});
