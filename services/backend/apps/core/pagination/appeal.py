from rest_framework.pagination import PageNumberPagination


class AppealPagination(PageNumberPagination):
    page_size = 20
