from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from nice import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'nice.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'popup-template', views.popup, name="popup"),
    url(r'^testview', views.testview, name="testview"),
)
