import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';

type FormData = {
  place: string;
  email: string;
  categories: {
    [key: string]: boolean;
  };
};

type ContactFormProps = {
  selectedPlace?: string;
};

const FOOD_CATEGORIES = [
  'Бары',
  'Быстрое питание',
  'Доставка еды',
  'Кафе',
  'Кафе-кондитерские',
  'Кейтеринг',
  'Комбинаты питания',
  'Кофейни',
  'Кофейни автоматы',
  'Кулинарии',
  'Пекарни',
  'Пиццерии',
  'Рестораны',
  'Рюмочные',
  'Столовые',
  'Суши-бары',
  'Точки безалкогольных напитков',
  'Точки кофе',
  'Фудмоллы',
  'Чайные клубы',
];

export default function ContactForm({ selectedPlace }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    mode: 'onChange', // Включаем валидацию при изменении полей
    defaultValues: {
      place: selectedPlace || '',
      email: '',
      categories: FOOD_CATEGORIES.reduce((acc, category) => ({
        ...acc,
        [category]: true
      }), {}),
    },
  });

  // Следим за всеми необходимыми полями
  const categories = watch('categories');
  const place = watch('place');
  const email = watch('email');
  
  // Проверяем все условия для активации кнопки
  const isAtLeastOneChecked = Object.values(categories).some(value => value);
  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email || '');
  const isPlaceFilled = !!place?.trim();
  const isFormValid = isAtLeastOneChecked && isEmailValid && isPlaceFilled;

  useEffect(() => {
    if (selectedPlace) {
      setValue('place', selectedPlace);
    }
  }, [selectedPlace, setValue]);

  const onSubmit = (data: FormData) => {
    if (isFormValid) {
      console.log(data);
      // Здесь будет логика отправки формы
    }
  };

  return (
    <div id="contact-form" className="max-w-2xl w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Получить доступ к дашборду
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Поле Место */}
        <div>
          <label htmlFor="place" className="block text-sm font-medium text-gray-700">
            Место
          </label>
          <input
            {...register('place', { 
              required: 'Укажите место',
              minLength: {
                value: 1,
                message: 'Поле не может быть пустым'
              }
            })}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.place && (
            <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
          )}
        </div>

        {/* Секция чекбоксов */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Категории общественного питания
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <FormGroup className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FOOD_CATEGORIES.map((category) => (
                <Controller
                  key={category}
                  name={`categories.${category}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={category}
                      className="text-sm"
                    />
                  )}
                />
              ))}
            </FormGroup>
            {!isAtLeastOneChecked && (
              <FormHelperText error>
                Выберите хотя бы одну категорию
              </FormHelperText>
            )}
          </div>
        </div>

        {/* Поле Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Укажите email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Текст с условиями */}
        <div className="text-xs text-gray-500">
          Нажимая кнопку «Купить за 1500 руб.», вы принимаете условия{' '}
          <a 
            href="https://law.2gis.ru/platform-manager" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Пользовательского соглашения
          </a>
          . Условия и цели обработки персональных данных определены в{' '}
          <a 
            href="https://law.2gis.ru/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Политике конфиденциальности
          </a>
          .{' '}
          <a 
            href="https://law.2gis.ru/personal-data-dublgis" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Политика обработки персональных данных
          </a>
          .
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            isFormValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Купить за 1500 руб.
        </button>
      </form>
    </div>
  );
} 